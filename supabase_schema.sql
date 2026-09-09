-- ==============================================================================
-- IELTS WRITING STUDIO - SUPABASE DATABASE SCHEMA & RLS SETUP
-- Phiên bản: 2.1 (Hỗ trợ Đồng bộ Đám mây, Kho Đề Thi Riêng Tư & Cộng Đồng Phương Án C)
-- Hướng dẫn: Copy toàn bộ nội dung file này và dán vào Supabase -> SQL Editor -> Run.
-- ==============================================================================

-- 1. BẢNG 1: USER_SUBMISSIONS (Lưu lịch sử bài làm & Kết quả chấm AI)
CREATE TABLE IF NOT EXISTS public.user_submissions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task JSONB NOT NULL,
    essay_text TEXT NOT NULL,
    evaluation JSONB,
    stats JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BẢNG 2: USER_VOCAB (Sổ tay từ vựng & Collocations cá nhân)
CREATE TABLE IF NOT EXISTS public.user_vocab (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phrase TEXT NOT NULL,
    meaning_vi TEXT DEFAULT '',
    example TEXT DEFAULT '',
    topic TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG 3: USER_CUSTOM_TASKS (Đề bài cá nhân tự tạo / AI sinh / Thư viện đề cộng đồng)
CREATE TABLE IF NOT EXISTS public.user_custom_tasks (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    creator_email TEXT DEFAULT 'Anonymous',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Đảm bảo các cột mới luôn tồn tại kể cả khi bảng đã được tạo từ các phiên bản trước
ALTER TABLE public.user_custom_tasks ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE public.user_custom_tasks ADD COLUMN IF NOT EXISTS creator_email TEXT DEFAULT 'Anonymous';
ALTER TABLE public.user_custom_tasks ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- ==============================================================================
-- 4. BẬT TÍNH NĂNG BẢO MẬT CẤP HÀNG (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocab ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_tasks ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 5. CHÍNH SÁCH BẢO MẬT (POLICIES) CHO BẢNG USER_SUBMISSIONS
-- ==============================================================================
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.user_submissions;
CREATE POLICY "Users can view their own submissions"
    ON public.user_submissions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.user_submissions;
CREATE POLICY "Users can insert their own submissions"
    ON public.user_submissions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own submissions" ON public.user_submissions;
CREATE POLICY "Users can update their own submissions"
    ON public.user_submissions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own submissions" ON public.user_submissions;
CREATE POLICY "Users can delete their own submissions"
    ON public.user_submissions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 6. CHÍNH SÁCH BẢO MẬT (POLICIES) CHO BẢNG USER_VOCAB
-- ==============================================================================
DROP POLICY IF EXISTS "Users can view their own vocab" ON public.user_vocab;
CREATE POLICY "Users can view their own vocab"
    ON public.user_vocab FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own vocab" ON public.user_vocab;
CREATE POLICY "Users can insert their own vocab"
    ON public.user_vocab FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own vocab" ON public.user_vocab;
CREATE POLICY "Users can update their own vocab"
    ON public.user_vocab FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own vocab" ON public.user_vocab;
CREATE POLICY "Users can delete their own vocab"
    ON public.user_vocab FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 7. CHÍNH SÁCH BẢO MẬT (POLICIES) CHO BẢNG USER_CUSTOM_TASKS
-- (Hỗ trợ mô hình Phương án C: Đề bài riêng tư + Chia sẻ đề thi cộng đồng)
-- ==============================================================================

-- A. SELECT: Người dùng xem được đề thi của CHÍNH HỌ hoặc đề thi được CÔNG KHAI (is_public = true)
-- Cho phép cả khách vãng lai (anon) và người dùng đăng nhập (authenticated) khám phá đề công khai
DROP POLICY IF EXISTS "Anyone can view public tasks or their own tasks" ON public.user_custom_tasks;
CREATE POLICY "Anyone can view public tasks or their own tasks"
    ON public.user_custom_tasks FOR SELECT
    TO authenticated, anon
    USING (is_public = true OR auth.uid() = user_id);

-- B. INSERT: Người dùng đăng nhập chỉ được thêm đề cho chính tài khoản của mình
DROP POLICY IF EXISTS "Authenticated users can create custom tasks" ON public.user_custom_tasks;
CREATE POLICY "Authenticated users can create custom tasks"
    ON public.user_custom_tasks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- C. UPDATE: Chỉ chính chủ mới có quyền sửa đề hoặc bật/tắt chia sẻ công khai
DROP POLICY IF EXISTS "Users can update their own custom tasks" ON public.user_custom_tasks;
CREATE POLICY "Users can update their own custom tasks"
    ON public.user_custom_tasks FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- D. DELETE: Chỉ chính chủ mới có quyền xóa đề của mình
DROP POLICY IF EXISTS "Users can delete their own custom tasks" ON public.user_custom_tasks;
CREATE POLICY "Users can delete their own custom tasks"
    ON public.user_custom_tasks FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. TẠO INDEXES ĐỂ TỐI ƯU HÓA TỐC ĐỘ TRUY VẤN (PERFORMANCE INDEXES)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_user_submissions_user_id ON public.user_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_created_at ON public.user_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_vocab_user_id ON public.user_vocab(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vocab_created_at ON public.user_vocab(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_custom_tasks_user_id ON public.user_custom_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_tasks_public ON public.user_custom_tasks(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_custom_tasks_created_at ON public.user_custom_tasks(created_at DESC);

-- ==============================================================================
-- HOÀN TẤT SETUP!
-- Khi chạy xong trong Supabase SQL Editor, hệ thống sẽ báo:
-- "Success. No rows returned"
-- Toàn bộ dữ liệu của bạn sẽ được bảo mật 100% và tính năng chia sẻ đề cộng đồng sẽ hoạt động hoàn hảo.
-- ==============================================================================
