# -*- coding: utf-8 -*-
"""
Script tạo tài liệu Word: CẨM NANG NON-TECH - TỰ TAY LÀM WEB CHUYÊN NGHIỆP CÙNG ANTIGRAVITY
Case Study: IELTS Web
Sử dụng python-docx với định dạng chuyên nghiệp chuẩn sách hướng dẫn / cẩm nang đào tạo.
"""

import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_run_font(run, font_name="Calibri"):
    run.font.name = font_name
    rPr = run._r.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.append(rFonts)
    rFonts.set(qn('w:ascii'), font_name)
    rFonts.set(qn('w:hAnsi'), font_name)
    rFonts.set(qn('w:cs'), font_name)
    rFonts.set(qn('w:eastAsia'), font_name)

def set_cell_margins(cell, top=140, bottom=140, left=200, right=200):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex: str):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_border(cell, left_color="2563EB", left_sz="36", bg_color="F8FAFC"):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:top w:val="none"/>'
        f'  <w:left w:val="single" w:sz="{left_sz}" w:space="0" w:color="{left_color}"/>'
        f'  <w:bottom w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)
    set_cell_shading(cell, bg_color)
    set_cell_margins(cell, top=160, bottom=160, left=240, right=200)

def add_header_footer(doc):
    for s in doc.sections:
        # Header
        header = s.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("CẨM NANG NON-TECH: XÂY DỰNG WEB CÙNG ANTIGRAVITY | CASE STUDY IELTS WEB")
        set_run_font(hrun, "Calibri")
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184) # Slate 400

        # Footer
        footer = s.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Tài liệu hướng dẫn thực chiến • Không yêu cầu kiến thức lập trình trước")
        set_run_font(frun, "Calibri")
        frun.font.size = Pt(9)
        frun.font.color.rgb = RGBColor(148, 163, 184)

def add_callout(doc, text, title="MẸO HAY CHO NGƯỜI NON-TECH", box_type="tip"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    cell = table.cell(0, 0)

    if box_type == "tip":
        border_col, bg_col = "10B981", "F0FDF4" # Green
        icon = "💡"
    elif box_type == "warning":
        border_col, bg_col = "EF4444", "FEF2F2" # Red
        icon = "⚠️"
    elif box_type == "concept":
        border_col, bg_col = "8B5CF6", "F5F3FF" # Purple
        icon = "🧠"
    else: # note
        border_col, bg_col = "3B82F6", "EFF6FF" # Blue
        icon = "📌"

    set_cell_border(cell, left_color=border_col, left_sz="36", bg_color=bg_col)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    r_title = p.add_run(f"{icon} {title}\n")
    set_run_font(r_title, "Calibri")
    r_title.bold = True
    r_title.font.size = Pt(10.5)
    if box_type == "tip":
        r_title.font.color.rgb = RGBColor(4, 120, 87)
    elif box_type == "warning":
        r_title.font.color.rgb = RGBColor(185, 28, 28)
    elif box_type == "concept":
        r_title.font.color.rgb = RGBColor(109, 40, 217)
    else:
        r_title.font.color.rgb = RGBColor(29, 78, 216)

    r_text = p.add_run(text)
    set_run_font(r_text, "Calibri")
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph().paragraph_format.space_after = Pt(2)

def add_prompt_box(doc, prompt_content, prompt_title="PROMPT THỰC HÀNH 1-CHẠM", notes=None):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    cell = table.cell(0, 0)

    set_cell_border(cell, left_color="2563EB", left_sz="36", bg_color="F8FAFC")

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15

    r_title = p.add_run(f"🚀 {prompt_title}\n")
    set_run_font(r_title, "Calibri")
    r_title.bold = True
    r_title.font.size = Pt(10.5)
    r_title.font.color.rgb = RGBColor(30, 58, 138)

    r_guide = p.add_run("(Copy toàn bộ đoạn văn bản bên dưới dán vào ô chat Antigravity):\n\n")
    set_run_font(r_guide, "Calibri")
    r_guide.italic = True
    r_guide.font.size = Pt(9.5)
    r_guide.font.color.rgb = RGBColor(100, 116, 139)

    r_code = p.add_run(prompt_content.strip())
    set_run_font(r_code, "Consolas")
    r_code.font.size = Pt(9.5)
    r_code.font.color.rgb = RGBColor(15, 23, 42)

    if notes:
        r_note = p.add_run(f"\n\n👉 Lưu ý khi dùng: {notes}")
        set_run_font(r_note, "Calibri")
        r_note.font.size = Pt(9.5)
        r_note.font.color.rgb = RGBColor(180, 83, 9) # Amber 700
        r_note.italic = True

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def format_table(table, col_widths, headers, data):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].width = Inches(col_widths[i])
        set_cell_shading(hdr_cells[i], "1E3A8A") # Navy
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(title)
        set_run_font(run, "Calibri")
        run.bold = True
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(255, 255, 255)

    # Data rows
    for r_idx, row_data in enumerate(data):
        row = table.add_row()
        row_cells = row.cells
        bg_col = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for i, val in enumerate(row_data):
            row_cells[i].width = Inches(col_widths[i])
            set_cell_shading(row_cells[i], bg_col)
            set_cell_margins(row_cells[i], top=100, bottom=100, left=140, right=140)
            
            # Add light bottom border
            tcPr = row_cells[i]._tc.get_or_add_tcPr()
            tcBorders = parse_xml(
                f'<w:tcBorders {nsdecls("w")}>'
                f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
                f'</w:tcBorders>'
            )
            tcPr.append(tcBorders)

            p = row_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            run = p.add_run(str(val))
            set_run_font(run, "Calibri")
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(51, 65, 85)

def add_h1(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(18)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    set_run_font(run, "Calibri")
    run.bold = True
    run.font.size = Pt(16)
    run.font.color.rgb = RGBColor(30, 58, 138) # #1E3A8A
    return h

def add_h2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    set_run_font(run, "Calibri")
    run.bold = True
    run.font.size = Pt(13)
    run.font.color.rgb = RGBColor(15, 118, 110) # #0F766E
    return h

def add_h3(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(8)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    set_run_font(run, "Calibri")
    run.bold = True
    run.font.size = Pt(11)
    run.font.color.rgb = RGBColor(71, 85, 105) # Slate 600
    return h

def add_p(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.25
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        set_run_font(r_pre, "Calibri")
        r_pre.bold = True
        r_pre.font.size = Pt(11)
        r_pre.font.color.rgb = RGBColor(30, 41, 59)
    r = p.add_run(text)
    set_run_font(r, "Calibri")
    r.font.size = Pt(11)
    r.italic = italic
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_bullet(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.2
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        set_run_font(r_pre, "Calibri")
        r_pre.bold = True
        r_pre.font.size = Pt(10.5)
        r_pre.font.color.rgb = RGBColor(30, 41, 59)
    r = p.add_run(text)
    set_run_font(r, "Calibri")
    r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def build_document():
    doc = Document()

    # Cấu hình lề trang 1 inch (2.54 cm)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # ==========================================
    # TRANG BÌA (COVER PAGE)
    # ==========================================
    cover_table = doc.add_table(rows=1, cols=1)
    cover_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cover_table.columns[0].width = Inches(6.5)
    c_cell = cover_table.cell(0, 0)
    set_cell_shading(c_cell, "1E3A8A") # Navy Blue Background
    set_cell_margins(c_cell, top=600, bottom=600, left=400, right=400)

    cp = c_cell.paragraphs[0]
    cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cp.paragraph_format.space_before = Pt(40)
    cp.paragraph_format.space_after = Pt(10)

    run_tag = cp.add_run("CẨM NANG THỰC CHIẾN KỶ NGUYÊN AI AGENT\n\n")
    set_run_font(run_tag, "Calibri")
    run_tag.bold = True
    run_tag.font.size = Pt(12)
    run_tag.font.color.rgb = RGBColor(147, 197, 253) # Light Blue

    run_title = cp.add_run("TỰ TAY LÀM WEB CHUYÊN NGHIỆP CÙNG ANTIGRAVITY\n")
    set_run_font(run_title, "Calibri")
    run_title.bold = True
    run_title.font.size = Pt(24)
    run_title.font.color.rgb = RGBColor(255, 255, 255)

    run_sub = cp.add_run("Hướng Dẫn Từng Bước Dành Riêng Cho Người Hoàn Toàn Chưa Biết Lập Trình\n(Zero-IT / Non-Technical)\n\n")
    set_run_font(run_sub, "Calibri")
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = RGBColor(226, 232, 240)

    cp2 = c_cell.add_paragraph()
    cp2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cp2.paragraph_format.space_before = Pt(20)
    cp2.paragraph_format.space_after = Pt(40)

    run_case = cp2.add_run("CASE STUDY THỰC TẾ: XÂY DỰNG NỀN TẢNG LUYỆN THI IELTS TRÊN MÁY TÍNH (IELTS WEB)\n")
    set_run_font(run_case, "Calibri")
    run_case.bold = True
    run_case.font.size = Pt(12)
    run_case.font.color.rgb = RGBColor(253, 224, 71) # Yellow

    run_meta = cp2.add_run("Tác giả: Nhóm Kỹ sư Dự án IELTS Web • Phiên bản 1.0 (2026)\nCông nghệ: Google Antigravity + React + Vite + Tailwind CSS")
    set_run_font(run_meta, "Calibri")
    run_meta.font.size = Pt(10)
    run_meta.font.color.rgb = RGBColor(203, 213, 225)

    doc.add_page_break()
    add_header_footer(doc)

    # ==========================================
    # LỜI NÓI ĐẦU & TƯ DUY MỚI
    # ==========================================
    add_h1(doc, "LỜI NÓI ĐẦU: TƯ DUY MỚI CỦA THỜI ĐẠI LẬP TRÌNH BẰNG AI AGENT")

    add_p(doc, 
        "Nếu bạn cầm tài liệu này trên tay và từng nghĩ rằng: \"Mình học xã hội / làm kinh doanh / dạy ngoại ngữ, "
        "chưa từng học IT thì làm sao tự tạo được một trang web phần mềm phức tạp?\", thì xin chúc mừng bạn: "
        "kỷ nguyên AI Agent như Google Antigravity đã hoàn toàn phá bỏ rào cản đó.")

    add_p(doc,
        "Trước đây, để xây dựng một ứng dụng như IELTS Web (với đầy đủ 4 kỹ năng Nghe - Nói - Đọc - Viết, "
        "chia đôi màn hình thi chuẩn quốc tế, tự động đếm giờ, thu âm giọng nói và chấm điểm band score), bạn cần "
        "một đội ngũ gồm lập trình viên giao diện (Frontend), lập trình viên máy chủ (Backend), nhân viên kiểm thử (QA) "
        "và quản lý dự án (PM) làm việc ròng rã trong 2-3 tháng. Nhưng ngày nay, bạn chỉ cần đóng đúng MỘT vai trò: "
        "Giám đốc Sản phẩm (Product Owner) – người có ý tưởng và biết cách giao việc cho Antigravity thi công.")

    add_callout(doc,
        "Trong quy trình làm việc với Antigravity, bạn KHÔNG cần học cú pháp ngôn ngữ lập trình (cách viết dấu chấm phẩy, "
        "vòng lặp hay thẻ HTML). Bạn chỉ cần rèn luyện 2 kỹ năng duy nhất:\n"
        "1. Kỹ năng mô tả rõ ràng điều bạn muốn (Prompting tư duy sản phẩm).\n"
        "2. Kỹ năng kiểm tra kết quả trên màn hình và phản hồi cho AI sửa tiếp (Review & Feedback).",
        title="ĐỊNH VỊ VAI TRÒ CỦA BẠN",
        box_type="concept"
    )

    add_h2(doc, "Hiểu Về Website Trong 3 Phút Bằng Ẩn Dụ Đời Thường")
    add_p(doc, "Để giao tiếp mượt mà với Antigravity, bạn chỉ cần nhớ 4 khái niệm đời sống sau đây:")

    add_bullet(doc, "Tương đương bộ khung xương của ngôi nhà hoặc cơ thể. Nó định hình chỗ nào là tiêu đề, chỗ nào là nút bấm, chỗ nào là khung nhập văn bản.", "1. HTML (Khung xương): ")
    add_bullet(doc, "Tương đương quần áo, lớp sơn tường, màu sắc và kiểu dáng. Nó quyết định nút bấm màu xanh hay đỏ, chữ to hay nhỏ, giao diện đẹp mắt hay thô kệch. Trong dự án này, chúng ta dùng Tailwind CSS – một bộ sưu tập màu sắc và kiểu dáng hiện đại cực đẹp.", "2. CSS (Ngoại hình): ")
    add_bullet(doc, "Tương đương bộ não và hệ cơ bắp. Nó xử lý logic: bấm nút thì đồng hồ đếm ngược chạy, gõ phím thì số lượng từ tăng lên, bấm nộp bài thì tính ra điểm thi.", "3. JavaScript / React (Bộ não): ")
    add_bullet(doc, "Người kỹ sư trưởng kiêm thợ xây bậc cao toàn năng. Bạn nói bằng tiếng Việt, Antigravity sẽ tự động tạo khung xương (HTML), may đo quần áo (CSS) và lập trình bộ não (React) ngay lập tức.", "4. Antigravity IDE (Kỹ sư trưởng): ")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 1
    # ==========================================
    add_h1(doc, "CHƯƠNG 1: CHUẨN BỊ \"BUỒNG LÁI\" KHÔNG CHẠM CODE PHỨC TẠP")

    add_p(doc, 
        "Nhiều người bỏ cuộc ngay từ bước cài đặt vì sợ các cửa sổ đen ngòm gõ lệnh (Terminal/Command Prompt). "
        "Đừng lo lắng! Với Antigravity, bạn chỉ cần cài đặt 2 phần mềm cơ bản duy nhất với thao tác bấm 'Next' chuột quen thuộc.")

    add_h2(doc, "1.1. Cài Đặt Node.js (Động Cơ Chạy Web)")
    add_p(doc, 
        "Node.js là một phần mềm nền tảng giúp máy tính của bạn hiểu và vận hành được các công nghệ web hiện đại. "
        "Bạn chỉ cần tải về và cài đặt một lần duy nhất giống như cài đặt phần mềm gõ tiếng Việt Unikey:")
    add_bullet(doc, "Truy cập trang chủ chính thức: https://nodejs.org", "Bước 1: ")
    add_bullet(doc, "Chọn phiên bản có nhãn 'LTS' (Long Term Support - Phiên bản ổn định khuyên dùng cho mọi người).", "Bước 2: ")
    add_bullet(doc, "Mở file tải về (.msi trên Windows), liên tục nhấn 'Next' cho đến khi hoàn tất mà không cần thay đổi bất kỳ tùy chọn mặc định nào.", "Bước 3: ")

    add_h2(doc, "1.2. Mở Antigravity IDE Và Thiết Lập Thư Mục Dự Án")
    add_p(doc, 
        "Antigravity là môi trường làm việc thông minh do Google DeepMind phát triển. Giao diện của Antigravity "
        "được chia làm 3 khu vực trực quan:")
    
    # Bảng phân vùng giao diện Antigravity
    ui_table = doc.add_table(rows=1, cols=3)
    format_table(
        ui_table,
        [1.8, 2.0, 2.7],
        ["Khu vực", "Tên gọi kỹ thuật", "Tác dụng đối với người Non-Tech"],
        [
            ["Cột bên trái", "File Explorer", "Cây thư mục chứa hình ảnh, bài tập, trang web (như File Explorer của Windows)."],
            ["Khu vực giữa", "Editor / Workspace", "Nơi Antigravity tự động mở file và viết code cho bạn xem."],
            ["Cột bên phải", "Agent Chat / Terminal", "Buồng lái đàm thoại. Bạn gõ tiếng Việt yêu cầu tính năng tại đây, AI sẽ đọc hiểu và tự động làm."]
        ]
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    add_h2(doc, "1.3. Nguyên Tắc Vàng Khi Giao Tiếp Với Antigravity")
    add_callout(doc,
        "Quy tắc số 1: 'KHÔNG TỰ TAY GÕ LỆNH TERMINAL'.\n"
        "Khi cần cài đặt thư viện, khởi động web, hay sửa lỗi, bạn chỉ cần nói với Antigravity trong ô chat: "
        "\"Hãy cài đặt thư viện X cho tôi\" hoặc \"Hãy khởi động web lên\". "
        "Antigravity có công cụ run_command để tự mở terminal và gõ lệnh thay cho bạn 100%!",
        title="NGUYÊN TẮC VÀNG CHO NGƯỜI MỚI",
        box_type="tip"
    )

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 2
    # ==========================================
    add_h1(doc, "CHƯƠNG 2: PHÂN TÍCH CASE STUDY \"IELTS WEB\" & LẬP KẾ HOẠCH 1-CHẠM")

    add_p(doc, 
        "Trước khi bắt tay vào xây dựng bất kỳ trang web nào, một Giám đốc Sản phẩm thông minh sẽ không bao giờ "
        "vội vàng code ngay mà sẽ yêu cầu AI lập Bản Đặc Tả Yêu Cầu Sản Phẩm (Product Requirements Document - PRD).")

    add_h2(doc, "2.1. Giải Mã Cấu Trúc Sản Phẩm Mẫu (IELTS Web)")
    add_p(doc, "Hãy quan sát những gì mà dự án IELTS Web đang có:")
    add_bullet(doc, "Màn hình được chia làm 2 nửa hoàn hảo: Bên trái là đề bài/bài đọc dài; Bên phải là ô soạn bài viết luận hoặc bảng trả lời câu hỏi.", "Giao diện phòng thi máy (CDI): ")
    add_bullet(doc, "Đồng hồ 60 phút đếm ngược từng giây, cảnh báo khi còn 5 phút cuối.", "Bộ đếm thời gian thực: ")
    add_bullet(doc, "Tự động đếm số từ đã viết, phát hiện lỗi lặp từ, đánh giá xem bài viết đã đạt chuẩn 150 từ (Task 1) hay 250 từ (Task 2) chưa.", "Trợ lý viết luận: ")
    add_bullet(doc, "Dữ liệu đề thi nằm sẵn trong máy, không cần kết nối internet hay máy chủ phức tạp vẫn làm bài mượt mà.", "Lưu trữ dữ liệu Offline: ")

    add_h2(doc, "2.2. Prompt 1-Chạm: Lập Bản Kế Hoạch Dự Án Toàn Diện")
    add_p(doc, "Hãy mở Antigravity, tạo một thư mục trống mới (ví dụ: `C:\\Projects\\My_IELTS_Web`), sau đó copy nguyên văn prompt sau vào ô chat:")

    prompt_prd = """Tôi là một người hoàn toàn không biết lập trình (Non-tech). Tôi muốn xây dựng một website luyện thi IELTS trên máy tính (chuẩn giao diện CDI) chạy trên máy tính cá nhân.
Các tính năng cốt lõi tôi mong muốn bao gồm:
1. Màn hình chia đôi (Split-screen): Bên trái xem đề thi và bài đọc, bên phải là khung soạn thảo văn bản làm bài.
2. Bộ đếm ngược thời gian làm bài (60 phút) và bộ đếm số từ tự động theo thời gian thực.
3. Thư viện đề thi mẫu có sẵn các đề Writing Task 1 và Task 2 để chọn nhanh.
4. Chạy hoàn toàn offline bằng dữ liệu lưu trữ trên trình duyệt (LocalStorage), không cần cài đặt cơ sở dữ liệu backend phức tạp.
5. Giao diện hiện đại, sạch sẽ bằng Tailwind CSS, có nút bấm biểu tượng trực quan.

Nhiệm vụ của bạn:
- Hãy đóng vai trò Trưởng nhóm Kiến trúc sư phần mềm, phân tích và lập kế hoạch chi tiết từng bước để hướng dẫn tôi xây dựng website này từ con số 0.
- Đề xuất công nghệ tối ưu và nhẹ nhất (khuyên dùng Vite + React + Tailwind CSS).
- Hãy liệt kê danh sách các file cần tạo và giải thích công dụng của từng file bằng ngôn ngữ đời thường, dễ hiểu cho người mới bắt đầu."""

    add_prompt_box(doc, prompt_prd, prompt_title="PROMPT SỐ 1: ĐẶC TẢ SẢN PHẨM & LẬP KẾ HOẠCH BẰNG TIẾNG VIỆT", 
                   notes="Bạn có thể thay đổi các tính năng ở mục 1-5 nếu muốn làm web khác (ví dụ: web trắc nghiệm từ vựng, web đọc truyện, v.v.)")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 3
    # ==========================================
    add_h1(doc, "CHƯƠNG 3: KHỞI TẠO DỰ ÁN & DỰNG KHUNG GIAO DIỆN ĐẦU TIÊN")

    add_p(doc, 
        "Sau khi Antigravity phân tích xong kế hoạch, bạn sẽ chuyển sang giai đoạn tạo khung sườn cho website. "
        "Giai đoạn này trong lập trình chuyên nghiệp gọi là \"Scaffolding\" (Dựng giàn giáo).")

    add_h2(doc, "3.1. Prompt 1-Chạm: Tự Động Khởi Tạo Dự Án Và Cài Thư Viện")
    add_p(doc, "Bạn không cần mở màn hình đen gõ lệnh `npm install` hay `npx create-vite`. Hãy gửi câu lệnh sau cho Antigravity:")

    prompt_init = """Hãy giúp tôi khởi tạo hoàn chỉnh dự án web này bằng công cụ run_command:
1. Tạo một dự án React sử dụng công cụ Vite siêu tốc (đặt tên dự án là ielts-prep).
2. Cài đặt các thư viện hỗ trợ giao diện đẹp mắt gồm: tailwindcss, lucide-react (bộ icon trực quan), và canvas-confetti (hiệu ứng pháo hoa chúc mừng khi nộp bài).
3. Cấu hình sẵn Tailwind CSS để sẵn sàng viết giao diện.
4. Tạo một trang chủ đơn giản hiển thị dòng chữ chào mừng: 'Hệ Thống Luyện Thi IELTS Trên Máy Tính - Sẵn Sàng Bắt Đầu'.
5. Khởi động máy chủ chạy thử (dev server) và cung cấp đường link để tôi xem trên trình duyệt."""

    add_prompt_box(doc, prompt_init, prompt_title="PROMPT SỐ 2: KHỞI TẠO NỀN TẢNG DỰ ÁN TỰ ĐỘNG", 
                   notes="Antigravity sẽ xin phép bạn chạy lệnh terminal. Bạn chỉ cần nhấn nút 'Approve' (Đồng ý) là hệ thống sẽ tự làm mọi thứ.")

    add_h2(doc, "3.2. Xem Thành Quả Trên Trình Duyệt")
    add_p(doc, 
        "Sau khi Antigravity thông báo hoàn tất, bạn sẽ thấy xuất hiện một địa chỉ dạng: ")
    add_p(doc, "http://localhost:5173", bold_prefix="👉 Địa chỉ web thử nghiệm: ")
    add_p(doc, 
        "Bạn chỉ cần giữ phím Ctrl và click chuột vào đường link này (hoặc copy dán vào Chrome/Edge). "
        "Trang web đầu tiên do chính bạn điều khiển AI tạo ra đã chính thức xuất hiện trên máy tính của bạn!")

    add_h2(doc, "3.3. Prompt 1-Chạm: Dựng Giao Diện Luyện Viết (Writing Workspace)")
    add_p(doc, "Bây giờ, chúng ta sẽ biến trang trắng tinh thành một phòng thi viết luận chuyên nghiệp với prompt sau:")

    prompt_ui = """Hãy xây dựng giao diện chính cho phần Luyện Viết (Writing Workspace) tại file src/components/WritingWorkspace.jsx với các thành phần sau:
1. Thanh tiêu đề phía trên (Top Bar):
   - Logo 'IELTS Mock Test CDI'.
   - Đồng hồ đếm ngược 60 phút có nút Bắt đầu / Tạm dừng.
   - Nút 'Nộp bài' màu xanh lá nổi bật.
2. Khu vực chia đôi màn hình (Split-screen 50:50):
   - Cột bên trái: Hộp hiển thị Đề bài (Prompt) và Hướng dẫn làm bài dạng chữ to rõ ràng.
   - Cột bên phải: Khung soạn thảo văn bản (Textarea) nền trắng, viền xám tinh tế, có bộ đếm số từ tự động hiển thị ở góc dưới (ví dụ: 'Số từ hiện tại: 185 / 250 từ').
3. Hãy áp dụng màu sắc chuẩn phòng thi quốc tế: Nền màu xám nhẹ (#F8FAFC), chữ màu xanh than đậm (#1E293B) để chống mỏi mắt.
4. Tích hợp component này vào file App.jsx để hiển thị ngay lập tức."""

    add_prompt_box(doc, prompt_ui, prompt_title="PROMPT SỐ 3: DỰNG GIAO DIỆN CHIA ĐÔI CHUẨN PHÒNG THI MÁY",
                   notes="Sau khi chạy prompt này, bạn chuyển sang cửa sổ trình duyệt và nhấn F5 để thấy giao diện lột xác ngoạn mục!")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 4
    # ==========================================
    add_h1(doc, "CHƯƠNG 4: ĐƯA DỮ LIỆU VÀO WEB MÀ KHÔNG CẦN CƠ SỞ DỮ LIỆU PHỨC TẠP")

    add_p(doc, 
        "Rất nhiều người học công nghệ bị 'ngợp' khi nghe đến khái niệm Cơ sở dữ liệu (Database, MySQL, MongoDB). "
        "Đối với một ứng dụng cá nhân hoặc quy mô trung bình, bạn hoàn toàn có thể lưu trữ toàn bộ đề thi trong một "
        "tệp JavaScript tĩnh siêu nhẹ nằm ngay trong thư mục `src/data/`.")

    add_h2(doc, "4.1. Bí Quyết \"File Dữ Liệu Tĩnh\" Của Dự Án IELTS Web")
    add_p(doc, 
        "Trong dự án IELTS Web thực tế, mọi đề thi Writing, bài đọc Reading và câu hỏi Speaking đều được lưu trong "
        "các tệp như `src/data/sampleTasks.js`. Cấu trúc của nó vô cùng trực quan và dễ hiểu, giống như một danh sách excel thu nhỏ:")

    data_preview = """// Ví dụ cấu trúc trong src/data/sampleTasks.js:
export const sampleTasks = [
  {
    id: "task2-education",
    type: "Task 2",
    title: "Chủ đề Giáo dục & Công nghệ",
    prompt: "Some people believe that university education should be free for all students. To what extent do you agree or disagree?",
    minWords: 250,
    timeMinutes: 40
  },
  {
    id: "task1-chart",
    type: "Task 1",
    title: "Biểu đồ tiêu thụ năng lượng",
    prompt: "The chart below shows energy consumption in different sectors from 2010 to 2025. Summarise the information...",
    minWords: 150,
    timeMinutes: 20
  }
];"""
    add_prompt_box(doc, data_preview, prompt_title="HÌNH DUNG VỀ TỆP DỮ LIỆU TĨNH (src/data/sampleTasks.js)", notes="Đây là nơi chứa nội dung mà người không biết code cũng có thể tự đọc và hiểu được nội dung chữ bên trong.")

    add_h2(doc, "4.2. Prompt 1-Chạm: Nhờ AI Tự Tạo Kho 10 Đề Thi Chuẩn Cambridge")
    add_p(doc, "Bạn không cần tự gõ từng câu chữ tiếng Anh vào code. Hãy yêu cầu Antigravity tạo tự động:")

    prompt_data = """Hãy tạo một tệp dữ liệu đề thi tại đường dẫn `src/data/sampleTasks.js`.
Trong tệp này, hãy biên soạn 10 đề thi IELTS Writing thực tế chuẩn Cambridge (gồm 5 đề Task 1 và 5 đề Task 2 thuộc các chủ đề phổ biến: Giáo dục, Môi trường, Công nghệ, Y tế, Giao thông).
Mỗi đề cần có đầy đủ các thông tin:
- id: Mã định danh duy nhất (ví dụ: 'task2-env-01')
- type: 'Task 1' hoặc 'Task 2'
- topic: Tên chủ đề ngắn gọn
- prompt: Toàn bộ đề bài tiếng Anh chuẩn mực
- minWords: 150 (cho Task 1) hoặc 250 (cho Task 2)
- hints: Gợi ý 3 luận điểm chính bằng tiếng Anh để người học tham khảo khi bí ý tưởng.

Sau khi tạo xong file data, hãy cập nhật giao diện `WritingWorkspace.jsx` để có một ô chọn đề thi (Dropdown selector). Khi người dùng chọn đề nào, màn hình bên trái sẽ tự động đổi sang đề bài đó!"""

    add_prompt_box(doc, prompt_data, prompt_title="PROMPT SỐ 4: NẠP KHO ĐỀ THI TỰ ĐỘNG VÀ KẾT NỐI VÀO MÀN HÌNH", 
                   notes="Chỉ với 1 câu lệnh này, trang web của bạn đã sở hữu một ngân hàng đề thi phong phú có thể chọn học bất cứ lúc nào.")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 5
    # ==========================================
    add_h1(doc, "CHƯƠNG 5: THÊM TÍNH NĂNG TƯƠNG TÁC THÔNG MINH (TIMER, CHẤM ĐIỂM, GIỌNG NÓI)")

    add_p(doc, 
        "Một website chuyên nghiệp khác biệt với trang web tĩnh ở chỗ nó có khả năng phản hồi thông minh với hành động "
        "của người học. Trong chương này, chúng ta sẽ trang bị cho trang web 3 vũ khí lợi hại nhất của dự án IELTS Web.")

    add_h2(doc, "5.1. Tính Năng 1: Đồng Hồ Đếm Ngược & Tự Động Khóa Bài")
    add_p(doc, "Giúp người học rèn luyện áp lực phòng thi thực tế. Hãy dùng prompt sau:")

    prompt_timer = """Hãy nâng cấp đồng hồ đếm ngược trong WritingWorkspace với các logic thông minh:
1. Cho phép người dùng tùy chọn thời gian làm bài: 20 phút (Task 1), 40 phút (Task 2) hoặc 60 phút (Full test).
2. Khi thời gian còn dưới 5 phút, đổi màu đồng hồ sang màu đỏ nhấp nháy cảnh báo.
3. Khi hết giờ (00:00), tự động phát ra một tiếng bíp nhẹ thông báo, khóa khung gõ chữ (readonly) và tự động kích hoạt tính năng nộp bài."""

    add_prompt_box(doc, prompt_timer, prompt_title="PROMPT SỐ 5A: TÍCH HỢP ĐỒNG HỒ PHÒNG THI CHUYÊN NGHIỆP")

    add_h2(doc, "5.2. Tính Năng 2: Bộ Chấm Điểm 4 Tiêu Chí IELTS (Live Band Rubric)")
    add_p(doc, 
        "Làm sao để người học biết bài viết của mình đang ở khoảng Band điểm nào mà không cần giám khảo chấm ngay lập tức? "
        "Dự án IELTS Web sử dụng một thuật toán phân tích văn bản cục bộ:")

    prompt_scoring = """Hãy xây dựng một module chấm điểm và phân tích bài viết tại `src/services/ieltsEvaluator.js` và hiển thị kết quả sau khi bấm 'Nộp bài':
1. Phân tích 4 tiêu chí cốt lõi:
   - Task Response (Độ dài bài viết so với yêu cầu tối thiểu).
   - Coherence & Cohesion (Phát hiện các từ nối liên kết câu như 'Furthermore', 'However', 'In addition', 'Consequently').
   - Lexical Resource (Đếm số lượng từ vựng học thuật C1-C2 và độ đa dạng từ vựng).
   - Grammatical Accuracy (Kiểm tra độ dài câu trung bình, tránh viết câu quá cụt hoặc câu quá dài lủng củng).
2. Khi người dùng bấm 'Nộp bài', hãy hiển thị một cửa sổ bật lên (Modal) đẹp mắt, có bảng điểm ước lượng từ 0.0 đến 9.0 và danh sách các lời khuyên cải thiện bài viết."""

    add_prompt_box(doc, prompt_scoring, prompt_title="PROMPT SỐ 5B: TÍCH HỢP TRỢ LÝ PHÂN TÍCH TIÊU CHÍ BAND ĐIỂM")

    add_h2(doc, "5.3. Tính Năng 3: Tích Hợp Giọng Nói (Web Speech API)")
    add_p(doc, 
        "Một bí mật thú vị: Trình duyệt của bạn (Chrome, Edge) đã có sẵn công nghệ AI đọc và nghe giọng nói miễn phí "
        "gọi là Web Speech API. Bạn không cần tốn tiền mua API của OpenAI hay Google!")

    prompt_speech = """Hãy bổ sung tính năng đọc đề và luyện nghe nói bằng Web Speech API có sẵn của trình duyệt:
1. Thêm một nút biểu tượng chiếc loa bên cạnh đề bài. Khi người học bấm vào, website sẽ tự động phát âm đọc to đề bài bằng giọng tiếng Anh bản xứ chuẩn xác.
2. Thêm một nút Micro thu âm. Khi người học bấm nói, website sẽ chuyển giọng nói thành văn bản hiển thị trực tiếp lên màn hình để luyện phản xạ Speaking."""

    add_prompt_box(doc, prompt_speech, prompt_title="PROMPT SỐ 5C: TÍCH HỢP ĐỌC VÀ THU ÂM BẰNG WEB SPEECH API",
                   notes="Web Speech API hoạt động trực tiếp trên trình duyệt máy tính, không tốn bất kỳ chi phí nào!")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 6
    # ==========================================
    add_h1(doc, "CHƯƠNG 6: CẨM NANG XỬ LÝ SỰ CỐ (KHI GẶP LỖI, NGƯỜI NON-TECH LÀM GÌ?)")

    add_p(doc, 
        "Trong quá trình xây dựng web, điều chắc chắn 100% sẽ xảy ra là: Sẽ có lúc màn hình hiện màu đỏ báo lỗi, "
        "hoặc giao diện bị vỡ hạt, hoặc bấm nút mà không thấy phản hồi. "
        "Người không biết IT thường hoảng sợ ở bước này và nghĩ rằng mình đã làm hỏng mọi thứ. Hãy nhớ rõ nguyên tắc dưới đây:")

    add_callout(doc,
        "Định luật số 1 của Non-Tech Developer: \"LỖI KHÔNG PHẢI LÀ THẤT BẠI, LỖI CHỈ LÀ THÔNG BÁO ĐỂ AI SỬA TIẾP\".\n"
        "Mọi thông báo lỗi màu đỏ (Error Message) thực chất là lời nhắn mà máy tính viết riêng cho lập trình viên. "
        "Bạn không cần hiểu từng chữ tiếng Anh trong đó, nhiệm vụ duy nhất của bạn là 'CHỤP LẠI VÀ CHUYỂN CHO ANTIGRAVITY'.",
        title="TÂM LÝ CHIẾN THẮNG KHI GẶP LỖI",
        box_type="warning"
    )

    add_h2(doc, "Bộ 3 Prompt Thần Thánh Xử Lý Mọi Sự Cố")

    prompt_fix1 = """Tôi vừa chạy thử website và gặp thông báo lỗi sau trên màn hình / terminal:
[DÁN NGUYÊN VĂN ĐOẠN CHỮ BÁO LỖI VÀO ĐÂY]

Bạn hãy:
1. Giải thích cho tôi bằng 1-2 câu tiếng Việt dễ hiểu xem lỗi này nguyên nhân do đâu.
2. Tự động kiểm tra các file liên quan và sửa dứt điểm lỗi này giúp tôi.
3. Kiểm tra lại để đảm bảo website hoạt động bình thường trở lại."""

    add_prompt_box(doc, prompt_fix1, prompt_title="PROMPT CỨU HỘ 1: CHẨN ĐOÁN & TỰ ĐỘNG SỬA LỖI (QUAN TRỌNG NHẤT)")

    prompt_fix2 = """Tính năng vừa thêm vào khiến giao diện bị lỗi và không như ý tôi muốn.
Hãy hủy bỏ các thay đổi gần nhất vừa thực hiện và khôi phục mã nguồn về trạng thái hoạt động tốt trước đó.
Sau khi khôi phục, hãy kiểm tra lại và thông báo cho tôi."""

    add_prompt_box(doc, prompt_fix2, prompt_title="PROMPT CỨU HỘ 2: QUAY LẠI TRẠNG THÁI CŨ AN TOÀN (ROLLBACK)")

    prompt_fix3 = """Website của tôi hiện đang chạy tốt nhưng tôi thấy mã nguồn có nhiều file thừa hoặc code chưa gọn gàng.
Hãy thực hiện rà soát toàn bộ dự án:
1. Xóa các biến không dùng đến, dọn dẹp các đoạn code thừa.
2. Kiểm tra xem có nguy cơ giật lag hay rò rỉ bộ nhớ không.
3. Giữ nguyên 100% tính năng và giao diện hiện tại của tôi."""

    add_prompt_box(doc, prompt_fix3, prompt_title="PROMPT CỨU HỘ 3: TỐI ƯU HÓA & LÀM SẠCH MÃ NGUỒN")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 7
    # ==========================================
    add_h1(doc, "CHƯƠNG 7: ĐÓNG GÓI SẢN PHẨM ĐỂ CHIA SẺ CHO NGƯỜI KHÁC DÙNG")

    add_p(doc, 
        "Chúc mừng bạn! Website đã hoàn thiện và chạy mượt mà. Tuy nhiên, bạn không thể mỗi lần muốn dùng lại phải "
        "mở Antigravity lên và gõ lệnh. Bạn cần đóng gói nó thành sản phẩm có thể dùng hàng ngày hoặc gửi cho bạn bè.")

    add_h2(doc, "7.1. Cách 1: Tạo File Khởi Động 1-Click Trên Windows (.bat)")
    add_p(doc, 
        "Trong dự án IELTS Web mẫu, có một tệp mang tên `Khoi_Dong_IELTS_Web.bat`. Đây là một tệp thần kỳ: "
        "Mỗi khi bạn muốn luyện thi, bạn chỉ cần click đúp chuột vào tệp này như mở một game offline, website sẽ tự động "
        "bật lên trên trình duyệt trong 2 giây mà không cần mở Antigravity!")

    prompt_bat = """Hãy tạo cho tôi một file khởi động tự động có tên `Khoi_Dong_Website.bat` ở ngay thư mục gốc của dự án.
Khi tôi click đúp chuột vào file này trên Windows, nó sẽ tự động:
1. Kiểm tra xem máy đã cài đặt thư viện chưa (nếu chưa thì tự cài đặt).
2. Khởi động máy chủ web Vite ở chế độ ngầm.
3. Tự động mở trình duyệt mặc định (Chrome/Edge) truy cập thẳng vào trang web http://localhost:5173.
4. Hiển thị thông báo tiếng Việt thân thiện: 'Website đã khởi động thành công! Chúc bạn học tốt.'"""

    add_prompt_box(doc, prompt_bat, prompt_title="PROMPT SỐ 6: TẠO FILE KÍCH HOẠT 1-CHẠM TRÊN WINDOWS (.BAT)",
                   notes="Sau khi file được tạo, bạn có thể tạo Shortcut đưa ra màn hình Desktop để mở hàng ngày cực kỳ tiện lợi.")

    add_h2(doc, "7.2. Cách 2: Đưa Website Lên Mạng Internet Toàn Cầu Miễn Phí (Vercel)")
    add_p(doc, 
        "Nếu bạn muốn chia sẻ đường link cho học sinh, đồng nghiệp hay bạn bè ở bất cứ đâu trên điện thoại và máy tính "
        "đều vào được, nền tảng đám mây Vercel là giải pháp số 1 thế giới hiện nay:")

    add_bullet(doc, "Tạo một tài khoản miễn phí tại trang web: https://vercel.com (chỉ cần đăng nhập bằng tài khoản Google).", "Bước 1: ")
    add_bullet(doc, "Yêu cầu Antigravity đóng gói sản phẩm bằng prompt dưới đây.", "Bước 2: ")
    add_bullet(doc, "Tải thư mục `dist` (thư mục thành phẩm) lên Vercel. Trong 30 giây, bạn sẽ nhận được một đường link web chính thức có đuôi `.vercel.app` để chia sẻ cho cả thế giới!", "Bước 3: ")

    prompt_deploy = """Hãy đóng gói toàn bộ dự án web này thành phiên bản triển khai thực tế (Production Build):
1. Chạy lệnh đóng gói mã nguồn để tạo ra thư mục `dist` chứa sản phẩm cuối cùng.
2. Tạo file cấu hình `vercel.json` để đảm bảo khi người dùng tải trang web hoặc chia sẻ đường link trên mạng không bao giờ bị lỗi 404.
3. Hướng dẫn tôi 3 bước đơn giản nhất để kéo thả thư mục này lên Vercel và lấy link web trực tuyến."""

    add_prompt_box(doc, prompt_deploy, prompt_title="PROMPT SỐ 7: ĐÓNG GÓI XUẤT BẢN RA TOÀN CẦU (DEPLOYMENT)")

    doc.add_page_break()

    # ==========================================
    # PHỤ LỤC & TỔNG KẾT
    # ==========================================
    add_h1(doc, "PHỤ LỤC: BẢNG TRA CỨU NHANH DÀNH CHO NON-TECH DEVELOPER")

    add_h2(doc, "Bảng Tổng Hợp Quy Trình 7 Bước Làm Web Bằng AI")

    summary_table = doc.add_table(rows=1, cols=3)
    format_table(
        summary_table,
        [1.2, 2.3, 3.0],
        ["Bước", "Tên Giai Đoạn", "Hành Động Của Bạn (Non-Tech)"],
        [
            ["Bước 1", "Khởi động buồng lái", "Cài Node.js, mở Antigravity, tạo thư mục làm việc."],
            ["Bước 2", "Lập kế hoạch PRD", "Dán Prompt Số 1 để AI đề xuất kiến trúc và cấu trúc thư mục."],
            ["Bước 3", "Dựng khung Scaffolding", "Dán Prompt Số 2 để AI tự cài đặt thư viện và dựng dev server."],
            ["Bước 4", "Thiết kế giao diện", "Dán Prompt Số 3 để AI dựng màn hình chia đôi và nút bấm."],
            ["Bước 5", "Nạp dữ liệu tĩnh", "Dán Prompt Số 4 để AI tạo kho đề thi tại src/data/."],
            ["Bước 6", "Lắp tính năng logic", "Dán Prompt Số 5 để AI thêm Timer, bộ chấm điểm và giọng nói."],
            ["Bước 7", "Đóng gói & Xuất bản", "Tạo file .bat chạy offline hoặc đưa lên Vercel chia sẻ online."]
        ]
    )
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_h2(doc, "Lời Nhắn Nhủ Cuối Cùng")
    add_p(doc, 
        "Hành trình tạo ra một sản phẩm công nghệ giờ đây không còn thuộc về đặc quyền của những người học chuyên ngành "
        "Khoa học Máy tính. Nó thuộc về những người có ý tưởng, có sự kiên trì và biết cách cộng tác với AI Agent. "
        "Hãy bắt đầu ngay hôm nay, mở Antigravity lên và dán dòng prompt đầu tiên. Chúc bạn tạo ra những trang web tuyệt vời!")

    # Lưu tệp Word
    output_filename = "Cam_Nang_NonTech_Lap_Trinh_Web_Voi_Antigravity.docx"
    doc.save(output_filename)
    print(f"Document created successfully: {os.path.abspath(output_filename)}")

if __name__ == "__main__":
    build_document()
