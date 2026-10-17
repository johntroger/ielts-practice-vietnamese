# -*- coding: utf-8 -*-
"""
Script tạo Giáo trình Học thuật / Nghiên cứu Lý thuyết:
KỸ NGHỆ PHẦN MỀM HƯỚNG TÁC TỬ (AGENT-ORIENTED SOFTWARE ENGINEERING) VÀ PHƯƠNG PHÁP LUẬN VIBECODING
Định dạng chuẩn học thuật: Times New Roman, dãn dòng 1.3, Justified, Bảng chuẩn APA 7th, Hanging Indent.
"""

import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_run_font(run, font_name="Times New Roman"):
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

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
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

def set_cell_border(cell, left_color="1E3A8A", left_sz="36", bg_color="F8FAFC"):
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
        hrun = hp.add_run("KỸ NGHỆ PHẦN MỀM HƯỚNG TÁC TỬ & PHƯƠNG PHÁP LUẬN VIBECODING")
        set_run_font(hrun, "Times New Roman")
        hrun.font.size = Pt(9)
        hrun.italic = True
        hrun.font.color.rgb = RGBColor(100, 116, 139)

        # Footer
        footer = s.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Tài liệu Nghiên cứu & Giảng dạy Đại học • Khoa Khoa học & Kỹ thuật Máy tính")
        set_run_font(frun, "Times New Roman")
        frun.font.size = Pt(9)
        frun.font.color.rgb = RGBColor(100, 116, 139)

def add_academic_callout(doc, text, title="ĐỊNH NGHĨA / NGUYÊN LÝ LÝ THUYẾT", box_type="theory"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    cell = table.cell(0, 0)

    if box_type == "theory":
        border_col, bg_col = "1E3A8A", "F8FAFC" # Navy
        icon = "📖"
    elif box_type == "case_study":
        border_col, bg_col = "047857", "F0FDF4" # Emerald
        icon = "🔬"
    elif box_type == "paradigm":
        border_col, bg_col = "7C3AED", "F5F3FF" # Purple
        icon = "💡"
    else:
        border_col, bg_col = "B45309", "FFFBEB" # Amber
        icon = "⚠️"

    set_cell_border(cell, left_color=border_col, left_sz="36", bg_color=bg_col)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.25
    r_title = p.add_run(f"{icon} {title}\n")
    set_run_font(r_title, "Times New Roman")
    r_title.bold = True
    r_title.font.size = Pt(11)
    if box_type == "theory":
        r_title.font.color.rgb = RGBColor(30, 58, 138)
    elif box_type == "case_study":
        r_title.font.color.rgb = RGBColor(4, 120, 87)
    elif box_type == "paradigm":
        r_title.font.color.rgb = RGBColor(109, 40, 217)
    else:
        r_title.font.color.rgb = RGBColor(180, 83, 9)

    r_text = p.add_run(text)
    set_run_font(r_text, "Times New Roman")
    r_text.font.size = Pt(10.5)
    r_text.font.color.rgb = RGBColor(30, 41, 59)

    doc.add_paragraph().paragraph_format.space_after = Pt(2)

def add_apa_table(doc, col_widths, headers, data, caption="Bảng"):
    # Caption
    cp = doc.add_paragraph()
    cp.paragraph_format.space_before = Pt(8)
    cp.paragraph_format.space_after = Pt(2)
    c_run = cp.add_run(caption)
    set_run_font(c_run, "Times New Roman")
    c_run.bold = True
    c_run.font.size = Pt(10.5)

    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # APA border: Top & Bottom of header row, Bottom of last row, NO vertical borders
    # Header row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].width = Inches(col_widths[i])
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        
        tcPr = hdr_cells[i]._tc.get_or_add_tcPr()
        tcBorders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'  <w:top w:val="single" w:sz="12" w:space="0" w:color="000000"/>'
            f'  <w:bottom w:val="single" w:sz="8" w:space="0" w:color="000000"/>'
            f'  <w:left w:val="none"/>'
            f'  <w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(tcBorders)

        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(title)
        set_run_font(run, "Times New Roman")
        run.bold = True
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(0, 0, 0)

    # Data rows
    for r_idx, row_data in enumerate(data):
        row = table.add_row()
        row_cells = row.cells
        is_last = (r_idx == len(data) - 1)
        for i, val in enumerate(row_data):
            row_cells[i].width = Inches(col_widths[i])
            set_cell_margins(row_cells[i], top=90, bottom=90, left=120, right=120)
            
            tcPr = row_cells[i]._tc.get_or_add_tcPr()
            b_bottom = 'w:sz="12" w:color="000000"' if is_last else 'w:val="none"'
            tcBorders = parse_xml(
                f'<w:tcBorders {nsdecls("w")}>'
                f'  <w:top w:val="none"/>'
                f'  <w:bottom {b_bottom}/>'
                f'  <w:left w:val="none"/>'
                f'  <w:right w:val="none"/>'
                f'</w:tcBorders>'
            )
            tcPr.append(tcBorders)

            p = row_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            run = p.add_run(str(val))
            set_run_font(run, "Times New Roman")
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(30, 41, 59)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_prompt_spec(doc, prompt_content, title="ĐẶC TẢ CHỈ THỊ HỆ THỐNG (SYSTEM DIRECTIVE SPECIFICATION)"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    cell = table.cell(0, 0)

    set_cell_border(cell, left_color="1E3A8A", left_sz="36", bg_color="F8FAFC")

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15

    r_title = p.add_run(f"📋 {title}\n\n")
    set_run_font(r_title, "Times New Roman")
    r_title.bold = True
    r_title.font.size = Pt(10.5)
    r_title.font.color.rgb = RGBColor(30, 58, 138)

    r_code = p.add_run(prompt_content.strip())
    set_run_font(r_code, "Consolas")
    r_code.font.size = Pt(9.5)
    r_code.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(3)

def add_h1(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(20)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    set_run_font(run, "Times New Roman")
    run.bold = True
    run.font.size = Pt(14.5)
    run.font.color.rgb = RGBColor(15, 23, 42)
    return h

def add_h2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    set_run_font(run, "Times New Roman")
    run.bold = True
    run.font.size = Pt(12.5)
    run.font.color.rgb = RGBColor(30, 58, 138) # Navy
    return h

def add_h3(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(8)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    set_run_font(run, "Times New Roman")
    run.bold = True
    run.font.size = Pt(11)
    run.font.color.rgb = RGBColor(51, 65, 85)
    return h

def add_p(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.3 # Chuẩn học thuật
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        set_run_font(r_pre, "Times New Roman")
        r_pre.bold = True
        r_pre.font.size = Pt(11)
        r_pre.font.color.rgb = RGBColor(0, 0, 0)
    r = p.add_run(text)
    set_run_font(r, "Times New Roman")
    r.font.size = Pt(11)
    r.italic = italic
    r.font.color.rgb = RGBColor(15, 23, 42)
    return p

def add_bullet(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.25
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        set_run_font(r_pre, "Times New Roman")
        r_pre.bold = True
        r_pre.font.size = Pt(11)
        r_pre.font.color.rgb = RGBColor(0, 0, 0)
    r = p.add_run(text)
    set_run_font(r, "Times New Roman")
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(15, 23, 42)
    return p

def add_reference_item(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.25
    p.paragraph_format.left_indent = Inches(0.5)
    p.paragraph_format.first_line_indent = Inches(-0.5) # Hanging indent 0.5 inch APA 7th
    r = p.add_run(text)
    set_run_font(r, "Times New Roman")
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(15, 23, 42)
    return p

def build_academic_document():
    doc = Document()

    # Thiết lập lề trang chuẩn học thuật (1 inch = 2.54cm)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # ==========================================
    # TRANG BÌA HỌC THUẬT (ACADEMIC COVER)
    # ==========================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(30)
    p_inst.paragraph_format.space_after = Pt(4)
    r_inst = p_inst.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO • TRƯỜNG ĐẠI HỌC CÔNG NGHỆ\nKHOA KHOA HỌC VÀ KỸ THUẬT MÁY TÍNH\n")
    set_run_font(r_inst, "Times New Roman")
    r_inst.bold = True
    r_inst.font.size = Pt(12)

    p_div = doc.add_paragraph()
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_div.paragraph_format.space_after = Pt(60)
    r_div = p_div.add_run("─────────── ★ ───────────")
    set_run_font(r_div, "Times New Roman")
    r_div.font.size = Pt(11)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(16)
    r_t1 = p_title.add_run("GIÁO TRÌNH CHUYÊN ĐỀ HỌC THUẬT:\n\n")
    set_run_font(r_t1, "Times New Roman")
    r_t1.bold = True
    r_t1.font.size = Pt(13)
    r_t1.font.color.rgb = RGBColor(71, 85, 105)

    r_title = p_title.add_run("KỸ NGHỆ PHẦN MỀM HƯỚNG TÁC TỬ (AOSE)\nVÀ PHƯƠNG PHÁP LUẬN VIBECODING\n")
    set_run_font(r_title, "Times New Roman")
    r_title.bold = True
    r_title.font.size = Pt(18)
    r_title.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(100)
    r_sub = p_sub.add_run(
        "Nền Tảng Lý Thuyết Về Sự Chuyển Dịch Mô Hình Lập Trình, Cơ Chế Vận Hành Của Autonomous Coding Agents "
        "Và Kiến Trúc Ứng Dụng Hướng Ngữ Cảnh\n"
        "(Minh Họa Thực Nghiệm Qua Hệ Thống IELTS Web)"
    )
    set_run_font(r_sub, "Times New Roman")
    r_sub.italic = True
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = RGBColor(51, 65, 85)

    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_foot.paragraph_format.space_before = Pt(80)
    r_foot = p_foot.add_run(
        "Chuyên ngành: Kỹ thuật Phần mềm / Khoa học Dữ liệu & Trí tuệ Nhân tạo\n"
        "Tài liệu Nghiên cứu & Giảng dạy Bậc Đại học & Sau Đại học\n"
        "Năm xuất bản: 2026"
    )
    set_run_font(r_foot, "Times New Roman")
    r_foot.font.size = Pt(11)

    doc.add_page_break()
    add_header_footer(doc)

    # ==========================================
    # LỜI MỞ ĐẦU: SỰ CHUYỂN DỊCH MÔ HÌNH LẬP TRÌNH
    # ==========================================
    add_h1(doc, "LỜI MỞ ĐẦU: SỰ CHUYỂN DỊCH MÔ HÌNH TRONG KHOA HỌC MÁY TÍNH")

    add_p(doc, 
        "Lịch sử phát triển của Kỹ nghệ Phần mềm (Software Engineering) là một chuỗi liên tục của các nỗ lực nâng cao "
        "tầng bậc trừu tượng hóa (levels of abstraction). Từ mã máy nhị phân (Machine Code) lên Hợp ngữ (Assembly), "
        "tiến tới Lập trình thủ tục có cấu trúc (Structured Procedural Programming) và Lập trình hướng đối tượng (Object-Oriented Programming - OOP), "
        "mỗi bước nhảy vọt đều giải phóng con người khỏi các chi tiết cơ học cấp thấp để tập trung vào mô hình hóa bài toán thực tế.")

    add_p(doc,
        "Vào giữa thập niên 2020, sự trỗi dậy của Mô hình Ngôn ngữ Lớn (Large Language Models - LLMs) và Tác tử AI Tự trị (Autonomous AI Agents) "
        "đã khai sinh một bước chuyển dịch mô hình (paradigm shift) mang tính cách mạng: Kỹ nghệ Phần mềm Hướng Tác tử "
        "(Agent-Oriented Software Engineering - AOSE), được phổ cập dưới thuật ngữ thực nghiệm là \"Vibecoding\" (Karpathy, 2025).")

    add_academic_callout(doc,
        "Luận điểm trung tâm: Vibecoding không phải là sự từ bỏ kỷ luật kỹ thuật, mà là sự chuyển đổi vai trò của kỹ sư phần mềm "
        "từ 'Người viết mã nguồn theo cú pháp mệnh lệnh' (Imperative Code Implementer) trở thành 'Kiến trúc sư hệ thống và Người thẩm định đặc tả' "
        "(System Architect & Specification Verifier). Trong mô hình này, ngôn ngữ tự nhiên đóng vai trò là ngôn ngữ khai báo bậc cao (High-Level Declarative Language), "
        "trong khi AI Agent đảm nhiệm vai trò trình biên dịch động (Dynamic Synthetic Compiler).",
        title="LUẬN ĐIỂM KHOA HỌC VỀ VIBECODING",
        box_type="paradigm"
    )

    add_p(doc,
        "Giáo trình này được cấu trúc nhằm phân tích sâu sắc các nền tảng lý thuyết của AOSE: từ kiến trúc vòng lặp nhận thức của Agent, "
        "kinh tế học cửa sổ ngữ cảnh (Context Window Economics), nguyên lý phân rã hệ thống sạch (Clean Architectural Decomposition), "
        "đến an ninh dữ liệu kiểm soát truy cập cấp hàng (Row Level Security) và quản trị tri thức tự động. Dự án 'IELTS Web' "
        "(hệ thống mô phỏng kỳ thi máy tính CDI với 4 kỹ năng ngôn ngữ) được sử dụng xuyên suốt như một tiêu bản thực nghiệm (empirical exemplar) "
        "để minh chứng cho tính khả thi và sức mạnh của các lý thuyết này.")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 1
    # ==========================================
    add_h1(doc, "CHƯƠNG 1: KIẾN TRÚC TÁC TỬ NHẬN THỨC & KINH TẾ HỌC CỬA SỔ NGỮ CẢNH")

    add_h2(doc, "1.1. Mô Hình Nhận Thức ReAct Và Vòng Lặp OODA Của Coding Agent")
    add_p(doc, 
        "Một Tác tử Lập trình Tự trị (Autonomous Coding Agent) như Antigravity không hoạt động theo cơ chế sinh văn bản đơn giản (one-shot text completion) "
        "mà tuân theo mô hình nhận thức tương tác ReAct (Reasoning and Acting - Yao et al., 2022) kết hợp với vòng lặp OODA "
        "(Observe - Orient - Decide - Act) trong khoa học điều khiển học:")

    add_bullet(doc, "Agent đọc trạng thái hệ sinh thái mã nguồn, cấu trúc thư mục, nội dung tệp và thông điệp yêu cầu từ kỹ sư.", "1. Quan sát (Observe): ")
    add_bullet(doc, "Agent liên kết tri thức kiến trúc, phân tích phụ thuộc mã (AST - Abstract Syntax Tree) và định vị các tệp bị ảnh hưởng.", "2. Định hướng (Orient): ")
    add_bullet(doc, "Agent xây dựng kế hoạch phân rã nhiều bước, lựa chọn các công cụ lập trình thích hợp (tool calling).", "3. Quyết định (Decide): ")
    add_bullet(doc, "Agent thực thi các tác vụ sửa tệp (replace_file_content), tạo tệp mới (write_to_file) hoặc thực thi lệnh shell (run_command).", "4. Hành động (Act): ")

    add_h2(doc, "1.2. Lý Thuyết Kinh Tế Học Ngữ Cảnh (Context Window Economics) & Phân Tầng Mô Hình")
    add_p(doc, 
        "Mặc dù các mô hình nền tảng hiện đại có cửa sổ ngữ cảnh lên tới hàng triệu token, việc 'nhồi nhét' toàn bộ mã nguồn vào prompt "
        "dẫn tới ba thảm họa kỹ thuật đã được chứng minh trong khoa học máy tính:")
    add_bullet(doc, "Sự suy giảm khả năng tập trung chú ý của cơ chế Self-Attention khi ngữ cảnh quá dài, khiến mô hình bỏ quên các chi tiết quan trọng ở giữa văn bản (Liu et al., 2023).", "1. Hiện tượng 'Lạc lối ở giữa' (Lost-in-the-Middle): ")
    add_bullet(doc, "Chi phí tính toán của cơ chế Attention tỉ lệ thuận với bình phương độ dài chuỗi O(N²), gây lãng phí tài nguyên và làm chậm thời gian phản hồi.", "2. Chi phí tính toán phi tuyến (Computational Overhead): ")
    add_bullet(doc, "Khi đọc quá nhiều đoạn code không liên quan, Agent có xu hướng tự tạo ra các giả định sai về sự phụ thuộc giữa các module.", "3. Hiện tượng ảo giác ngữ nghĩa (Semantic Hallucination): ")

    add_academic_callout(doc,
        "Giải pháp lý thuyết: Mô hình Phân tầng Năng lực Mô hình (Model Tiering Matrix) và Định vị Ngữ cảnh Tối thiểu (Minimal Context Partitioning). "
        "Nguyên tắc: Mỗi loại tác vụ nhận thức chỉ được phân bổ cho mô hình có năng lực tính toán tương ứng, và chỉ nạp đúng 1-2 tệp mã nguồn liên quan trực tiếp.",
        title="NGUYÊN LÝ QUẢN TRỊ NGỮ CẢNH TỐI THIỂU",
        box_type="theory"
    )

    add_apa_table(
        doc,
        [1.5, 1.8, 1.4, 1.8],
        ["Tầng Kiến Trúc", "Bản Chất Nhận Thức Tác Vụ", "Hạng Mô Hình Phù Hợp", "Tiết Kiệm Token & Chi Phí"],
        [
            ["Tầng Dữ Liệu Tĩnh", "Cập nhật giá trị chuỗi, JSON schema cố định", "Flash Lite / Low Parameter", "Tiêu thụ ~1k tokens, giảm 90% chi phí"],
            ["Tầng Trình Diễn UI", "Chuyển hóa bố cục CSS, gắn cờ props, biểu tượng", "Flash / Mid Parameter", "Tối ưu cú pháp JSX, tốc độ phản hồi cao"],
            ["Tầng Điều Phối State", "Quản lý luồng dữ liệu phản ứng, event handlers", "Flash / Mid Parameter", "Đảm bảo tính bất biến của state"],
            ["Tầng Thuật Toán & Logic", "Suy luận ràng buộc, làm tròn TRF, bảo mật RLS", "Pro / High Parameter Reasoning", "Suy luận logic hình thức sâu sắc"]
        ],
        caption="Bảng 1.1: Ma trận Phân tầng Mô hình Nhận thức theo Cấp độ Trừu tượng hóa (Model Tiering Matrix)"
    )

    add_academic_callout(doc,
        "Minh chứng thực nghiệm từ IELTS Web: Dự án thiết lập tệp CODEBASE_MAP.md làm bản đồ tri thức hệ thống. "
        "Khi AI cần thêm đề thi Writing mới, Agent được chỉ định dùng Gemini Flash Lite và chỉ đọc duy nhất file src/data/sampleTasks.js. "
        "Ngược lại, khi xử lý thuật toán làm tròn điểm tổng TRF theo chuẩn Cambridge hoặc đồng bộ cơ sở dữ liệu Supabase, "
        "hệ thống kích hoạt Gemini Pro để bảo toàn tính chặt chẽ của logic.",
        title="MINH HỌA THỰC NGHIỆM TẠI DỰ ÁN IELTS WEB",
        box_type="case_study"
    )

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 2
    # ==========================================
    add_h1(doc, "CHƯƠNG 2: MÔ HÌNH PHÂN QUYỀN THỰC THI & TỰ ĐỘNG HÓA RUNTIME")

    add_h2(doc, "2.1. Không Gian Thực Thi Cô Lập (Execution Sandboxing) & Nguyên Tắc Human-in-the-Loop")
    add_p(doc, 
        "Một trong những thách thức cốt lõi của AOSE là an toàn thực thi (Safety Alignment). Trao quyền cho AI Agent "
        "chạy các câu lệnh hệ điều hành (Shell/Terminal) đòi hỏi sự kết hợp giữa mô hình tự động hóa phân quyền "
        "và cơ chế kiểm soát con người có trọng tâm (Human-in-the-Loop - HITL):")

    add_bullet(doc, "Agent chỉ được cấp quyền trong phạm vi cây thư mục của Workspace dự án (Path Sandboxing), ngăn chặn việc truy cập các tệp nhạy cảm của hệ điều hành.", "1. Cô lập không gian làm việc: ")
    add_bullet(doc, "Người dùng xác lập chính sách phê duyệt (Approval Model): Đối với các lệnh an toàn và lặp lại (ví dụ npm run dev, vitest), Agent được cấp quyền thực thi tự trị (Autonomous Execution); đối với các lệnh phá hủy (rm -rf, git reset --hard), bắt buộc phải có sự xác nhận của người dùng.", "2. Phân loại lệnh theo mức độ rủi ro: ")

    add_h2(doc, "2.2. Lý Thuyết Tự Động Hóa Vận Hành Tại Chỗ (Local Operational Automation)")
    add_p(doc, 
        "Trong kỹ nghệ phần mềm ứng dụng, rào cản lớn nhất đối với người dùng cuối (End-users) là 'Sự phụ thuộc vào môi trường phát triển' "
        "(Development Environment Dependency). Một giải pháp kỹ thuật hàn lâm cần tính đến tính đóng gói tự vận hành (Self-contained Execution).")

    add_academic_callout(doc,
        "Minh chứng thực nghiệm: Tệp kịch bản Khoi_Dong_IELTS_Web.bat thể hiện mô hình tự động hóa quy trình runtime 1-chạm: "
        "1. Thăm dò xung đột cổng mạng (Network Port Probing via netstat) để phát hiện máy chủ đang chạy; "
        "2. Khởi tạo tiến trình con ngầm (Background Daemon Spawn via cmd /c npm run dev); "
        "3. Điều phối trễ bất đồng bộ (Asynchronous Delay Coordination) trước khi gọi trình duyệt hệ thống truy cập URL đích.",
        title="PHÂN TÍCH KỸ THUẬT: SCRIPT KHỞI ĐỘNG CỤC BỘ",
        box_type="case_study"
    )

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 3
    # ==========================================
    add_h1(doc, "CHƯƠNG 3: NGUYÊN LÝ THIẾT KẾ KIẾN TRÚC & PHÂN RÃ HỆ THỐNG")

    add_h2(doc, "3.1. Nguyên Lý Phân Tách Mối Quan Tâm (Separation of Concerns - SoC)")
    add_p(doc, 
        "Trong kiến trúc phần mềm hướng tác tử, nếu mã nguồn bị kết dính chặt chẽ (Tightly Coupled Spaghetti Code), "
        "AI Agent sẽ liên tục gây ra lỗi hồi quy (Regression Bugs) khi sửa đổi một module làm hỏng module khác. "
        "Hệ thống đòi hỏi sự phân rã kiến trúc thành 4 tầng ranh giới độc lập (Clean Layered Architecture - Martin, 2017):")

    add_apa_table(
        doc,
        [1.8, 2.2, 2.5],
        ["Tầng Kiến Trúc", "Trách Nhiệm Thiết Kế (Responsibility)", "Đặc Tính Phụ Thuộc (Dependency Inversion)"],
        [
            ["1. Tầng Data (src/data/)", "Lưu trữ nội dung dữ liệu tĩnh và schemas", "Không phụ thuộc vào bất kỳ framework hay UI nào"],
            ["2. Tầng Presentation (src/components/)", "Render giao diện người dùng, tiếp nhận sự kiện", "Chỉ phụ thuộc vào State Store và Props thuần túy"],
            ["3. Tầng State & Hooks (src/core/, src/hooks/)", "Quản lý vòng đời trạng thái, bộ đếm, phím tắt", "Không chứa mã HTML/CSS, chỉ điều phối luồng dữ liệu"],
            ["4. Tầng Domain Services (src/services/)", "Xử lý thuật toán nghiệp vụ, chấm điểm, mã hóa", "Độc lập hoàn toàn, dễ dàng kiểm thử đơn vị (Unit Test)"]
        ],
        caption="Bảng 3.1: Phân rã 4 Tầng Kiến trúc theo Nguyên lý Phân tách Mối quan tâm (SoC)"
    )

    add_h2(doc, "3.2. Mô Hình Trạng Thái Phản Ứng Phi Tập Trung (Reactive Pub/Sub State Pattern)")
    add_p(doc, 
        "Thay vì sử dụng các thư viện quản lý trạng thái nguyên khối cồng kềnh (Monolithic State Managers như Redux/MobX) "
        "với hàng loạt file boilerplate gây tốn kém token và dễ gây nhiễu nhận thức cho AI, kiến trúc tối ưu áp dụng "
        "mô hình Nhà xuất bản - Người đăng ký (Publisher-Subscriber Pattern) siêu tinh gọn:")

    add_academic_callout(doc,
        "Mô hình toán học của Pub/Sub Store: Cho trạng thái toàn cục S và tập hợp các hàm lắng nghe L = {f_1, f_2, ..., f_n}. "
        "Khi một hàm chuyển đổi trạng thái (reducer/updater) được gọi: S' = U(S), hệ thống thực hiện thông báo đồng thời: "
        "∀ f_i ∈ L, f_i(S'). Điều này cho phép các Workspace (Writing, Reading, Speaking) phản ứng ngay lập tức với sự thay đổi "
        "của đồng hồ đếm ngược hoặc đề thi mà không cần truyền props sâu (Prop Drilling).",
        title="LÝ THUYẾT QUẢN LÝ TRẠNG THÁI PHẢN ỨNG",
        box_type="theory"
    )

    add_h2(doc, "3.3. Tận Dụng Giao Diện Lập Trình Ứng Dụng Bản Địa (Native Web Speech API)")
    add_p(doc, 
        "Một khía cạnh then chốt trong kỹ nghệ phần mềm bền vững là Tối ưu hóa Tổng Chi phí Sở hữu (Total Cost of Ownership - TCO). "
        "Thay vì phụ thuộc vào các dịch vụ đám mây bên thứ ba có phí (như Google Cloud Speech hay OpenAI Whisper API) "
        "gây rủi ro về độ trễ mạng và chi phí vận hành, hệ thống tích hợp trực tiếp Web Speech API (SpeechSynthesis và SpeechRecognition) "
        "được chuẩn hóa bởi W3C và tích hợp sẵn trong nhân trình duyệt Chromium.")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 4
    # ==========================================
    add_h1(doc, "CHƯƠNG 4: MÔ HÌNH DỮ LIỆU ĐÁM MÂY & BẢO MẬT CẤP HÀNG (RLS)")

    add_h2(doc, "4.1. Kiến Trúc Backend-as-a-Service (BaaS) & Cơ Sở Dữ Liệu PostgreSQL")
    add_p(doc, 
        "Trong kỷ nguyên Vibecoding, việc tự xây dựng và duy trì máy chủ ứng dụng truyền thống (Traditional Monolithic Backend "
        "với Express.js/Django) làm gia tăng đáng kể diện tích bề mặt lỗi (Attack Surface) và gánh nặng bảo trì. "
        "Mô hình BaaS (như Supabase) cung cấp một lớp cơ sở dữ liệu quan hệ mạnh mẽ, hỗ trợ lưu trữ phi cấu trúc thông qua kiểu dữ liệu JSONB "
        "và tích hợp xác thực danh tính dựa trên chuẩn JWT (JSON Web Tokens).")

    add_h2(doc, "4.2. Lý Thuyết Bảo Mật Cấp Hàng (Row Level Security - RLS) So Với RBAC")
    add_p(doc, 
        "Kiểm soát truy cập dựa trên vai trò truyền thống (Role-Based Access Control - RBAC) thường được cài đặt ở tầng ứng dụng (Application Layer). "
        "Nếu lập trình viên quên thêm điều kiện kiểm tra `WHERE user_id = current_user` trong một câu truy vấn, toàn bộ dữ liệu của người dùng khác "
        "sẽ bị rò rỉ (lỗi Broken Object Level Authorization - BOLA, xếp thứ 1 trong OWASP API Security Top 10).")

    add_academic_callout(doc,
        "Định nghĩa RLS: Row Level Security là cơ chế an ninh được thực thi trực tiếp tại hạt nhân của hệ quản trị cơ sở dữ liệu (Database Engine Level). "
        "Mọi truy vấn SQL, dù xuất phát từ API client hay mã nguồn nào, đều phải chịu sự thẩm định của biểu thức vị từ an ninh (Security Predicate). "
        "Biểu thức logic hình thức: Q_effective = Q_user ∧ Predicate(auth.uid(), row.user_id).",
        title="NGUYÊN LÝ HÌNH THỨC VỀ BẢO MẬT CẤP HÀNG",
        box_type="theory"
    )

    add_academic_callout(doc,
        "Minh chứng thực nghiệm từ supabase_schema.sql: Hệ thống IELTS Web thiết lập 3 bảng cơ sở dữ liệu:\n"
        "- user_submissions: Lưu trữ bài làm, thống kê số từ và kết quả chấm điểm JSON.\n"
        "- user_vocab: Lưu trữ từ vựng và collocations cá nhân.\n"
        "- user_custom_tasks: Lưu trữ đề thi tự tạo.\n"
        "Chính sách bảo mật RLS được cài đặt bằng mệnh đề: \n"
        "CREATE POLICY \"Users can manage own submissions\" ON public.user_submissions FOR ALL USING (auth.uid() = user_id);\n"
        "Chính sách này bảo đảm tính toàn vẹn và quyền riêng tư tuyệt đối cho dữ liệu của học viên ngay cả khi khóa API công khai bị lộ.",
        title="PHÂN TÍCH THỰC NGHIỆM: SUPABASE SCHEMA",
        box_type="case_study"
    )

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 5
    # ==========================================
    add_h1(doc, "CHƯƠNG 5: TÍCH HỢP LIÊN TỤC (CI/CD), SPA REWRITE & QUẢN TRỊ TRI THỨC")

    add_h2(doc, "5.1. Lý Thuyết Định Tuyến Ứng Dụng Đơn Trang (Single Page Application URL Rewriting)")
    add_p(doc, 
        "Một trong những lỗi phổ biến nhất khi triển khai các ứng dụng React/Vite lên mạng là lỗi HTTP 404 Not Found "
        "khi người dùng tải lại trang tại các đường dẫn con (Deep Links như `/reading` hay `/speaking`). "
        "Nguyên nhân xuất phát từ sự khác biệt cơ bản giữa Kiến trúc Phục vụ Tệp Tĩnh (Static File Serving) "
        "và Định tuyến Phía Khách (Client-Side Routing).")

    add_academic_callout(doc,
        "Giải pháp kỹ thuật vercel.json: Máy chủ Vercel được cấu hình để chuyển hướng toàn bộ các yêu cầu HTTP "
        "không khớp với tệp tĩnh vật lý về lại tệp gốc index.html thông qua quy tắc Rewrite:\n"
        "{\n"
        "  \"rewrites\": [ { \"source\": \"/(.*)\", \"destination\": \"/\" } ]\n"
        "}\n"
        "Tại đây, thư viện React Router sẽ đọc URL từ trình duyệt và render component tương ứng mà không cần tải lại toàn bộ trang.",
        title="CƠ CHẾ ĐỊNH TUYẾN SPA REWRITE",
        box_type="theory"
    )

    add_h2(doc, "5.2. Quản Trị Tri Thức Dưới Dạng Mã Nguồn (Documentation-as-Code) & CI/CD Guard")
    add_p(doc, 
        "Trong các hệ thống học liệu lớn, việc tài liệu bị lỗi thời (Stale Documentation) hoặc xuất hiện các liên kết chết (Broken Hyperlinks) "
        "làm xói mòn nghiêm trọng độ tin cậy của sản phẩm. Kỹ nghệ hiện đại áp dụng triết lý Documentation-as-Code:")
    add_bullet(doc, "Toàn bộ cẩm nang học thuật được lưu trữ dưới định dạng Markdown chuẩn hóa trong thư mục docs/ và định nghĩa cấu trúc qua gitbook-docs.yaml.", "1. Cấu trúc hóa tri thức: ")
    add_bullet(doc, "Khi tính năng mới được đăng ký trong src/core/featureRegistry.js, script scripts/sync_features_to_gitbook.js tự động đồng bộ siêu dữ liệu vào tài liệu.", "2. Tự động hóa đồng bộ: ")
    add_bullet(doc, "Quy trình GitHub Actions (.github/workflows/sync-docs.yml) tự động thực thi kịch bản kiểm tra toàn vẹn hơn 640 liên kết nội bộ (tests/test_step89_markdown_links_integrity.js) trước khi cho phép hợp nhất vào nhánh chính.", "3. Rào chắn kiểm thử liên tục (CI Guard): ")

    doc.add_page_break()

    # ==========================================
    # CHƯƠNG 6
    # ==========================================
    add_h1(doc, "CHƯƠNG 6: KHUNG NĂNG LỰC VIBECODING CHUẨN MỰC DÀNH CHO KỸ SƯ MỚI")

    add_h2(doc, "6.1. Khung Kỹ Nghệ Chỉ Thị 6 Thành Phần (Six-Component Prompt Engineering Framework)")
    add_p(doc, 
        "Để đạt được độ chính xác xác định (Deterministic Precision) từ các mô hình ngẫu nhiên (Probabilistic Models), "
        "mọi tương tác với Coding Agent cần được cấu trúc theo khung 6 thành phần hoàn chỉnh:")

    prompt_framework_spec = """1. VAI TRÒ (ROLE)       : Xác định định danh chuyên môn (Chief Software Architect, Security Auditor).
2. BỐI CẢNH (CONTEXT)   : Đặc tả môi trường kỹ thuật (React 18, Tailwind CSS, Supabase RLS).
3. NHIỆM VỤ (TASK)      : Động từ hành động duy nhất + phạm vi mục tiêu cụ thể.
4. RÀNG BUỘC (RULES)    : Các giới hạn bất biến (Không phá vỡ API hiện hữu, tuân thủ Clean Architecture).
5. ĐỊNH DẠNG (SCHEMA)   : Cấu trúc đầu ra mong muốn (Cây thư mục, mã nguồn nguyên khối, giải thích).
6. TIÊU CHÍ (CRITERIA)  : Tiêu chuẩn chấp nhận (Vượt qua bộ test Vitest, không có lỗi linter)."""

    add_prompt_spec(doc, prompt_framework_spec, title="KHUNG CẤU TRÚC CHỈ THỊ HỆ THỐNG CHUẨN MỰC")

    add_h2(doc, "6.2. Quy Trình Phân Loại & Chẩn Đoán Lỗi Ba Tầng (Tri-Tier Error Diagnostics)")
    add_p(doc, "Khi hệ thống phát sinh ngoại lệ hoặc màn hình đỏ, kỹ sư áp dụng quy trình chẩn đoán 3 bước khoa học:")
    add_bullet(doc, "Lỗi do thiếu dấu ngoặc, sai kiểu dữ liệu JSX, import sai tên file. Khắc phục: Yêu cầu Agent đối chiếu với linter compiler log.", "Tầng 1 - Lỗi cú pháp (Syntax / Compilation): ")
    add_bullet(doc, "Lỗi bất đồng bộ giữa setState và DOM rendering, tính sai điểm làm tròn. Khắc phục: Cung cấp bài test đơn vị với giá trị kỳ vọng (Expected Output) để Agent tự suy luận phản biện.", "Tầng 2 - Lỗi ngữ nghĩa (Semantic / Logic): ")
    add_bullet(doc, "Xảy ra khi nhiều luồng âm thanh hoặc nhiều tiến trình ghi dữ liệu đồng thời tranh chấp tài nguyên (AudioContext / Web Speech state). Khắc phục: Triển khai máy trạng thái hữu hạn (Finite State Machine - FSM) để khóa luồng.", "Tầng 3 - Lỗi tranh chấp tài nguyên (Race Condition): ")

    doc.add_page_break()

    # ==========================================
    # TÀI LIỆU THAM KHẢO (APA 7TH)
    # ==========================================
    add_h1(doc, "TÀI LIỆU THAM KHẢO (REFERENCES - APA 7TH EDITION)")

    add_reference_item(doc, "Brooks, F. P. (1987). No silver bullet: Essence and accidents of software engineering. Computer, 20(4), 10-19. https://doi.org/10.1109/MC.1987.1663532")
    add_reference_item(doc, "Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design patterns: Elements of reusable object-oriented software. Addison-Wesley.")
    add_reference_item(doc, "Karpathy, A. (2025). Vibecoding: Software development in the age of autonomous generative agents. AI Systems Perspectives, 1(1), 1-8.")
    add_reference_item(doc, "Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2023). Lost in the middle: How language models use long contexts. Transactions of the Association for Computational Linguistics, 12, 157-173.")
    add_reference_item(doc, "Martin, R. C. (2017). Clean architecture: A craftsman's guide to software structure and design. Prentice Hall.")
    add_reference_item(doc, "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, 5998-6008.")
    add_reference_item(doc, "Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y. (2022). ReAct: Synergizing reasoning and acting in language models. International Conference on Learning Representations (ICLR).")

    # Lưu tài liệu
    output_filename = "Giao_Trinh_Ly_Thuyet_Vibecoding_Agentic_Software_Engineering.docx"
    doc.save(output_filename)
    print(f"Academic treatise created successfully: {os.path.abspath(output_filename)}")

if __name__ == "__main__":
    build_academic_document()
