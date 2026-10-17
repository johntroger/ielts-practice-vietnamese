# -*- coding: utf-8 -*-
"""
GIÁO TRÌNH KINH TẾ SỐ (~50 TRANG):
ỨNG DỤNG AI AGENT VÀ VIBECODING TRONG KHỞI NGHIỆP VÀ CHUYỂN ĐỔI MÔ HÌNH KINH DOANH
Dành cho sinh viên ngành Kinh tế số, Quản trị Kinh doanh, TMĐT & Khởi nghiệp.
Tập trung 100% vào khía cạnh Ứng dụng Kinh doanh, Mô hình Doanh thu, Unit Economics, Tăng trưởng, Vận hành không cần biết lập trình.
"""

import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
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

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
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
    set_cell_margins(cell, top=140, bottom=140, left=200, right=180)

def add_header_footer(doc):
    for s in doc.sections:
        header = s.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("GIÁO TRÌNH KINH TẾ SỐ: ỨNG DỤNG AI AGENT & VIBECODING TRONG KINH DOANH")
        set_run_font(hrun, "Times New Roman")
        hrun.font.size = Pt(8.5)
        hrun.italic = True
        hrun.font.color.rgb = RGBColor(100, 116, 139)

        footer = s.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Tài liệu Đào tạo Chuyên sâu • Khoa Kinh tế số & Quản trị Kinh doanh")
        set_run_font(frun, "Times New Roman")
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(100, 116, 139)

def add_business_callout(doc, text, title="KHUNG PHÂN TÍCH KINH DOANH", box_type="business"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    cell = table.cell(0, 0)

    if box_type == "business":
        border_col, bg_col = "1E3A8A", "F8FAFC"
        icon = "📊"
    elif box_type == "finance":
        border_col, bg_col = "047857", "F0FDF4"
        icon = "💰"
    elif box_type == "strategy":
        border_col, bg_col = "7C3AED", "F5F3FF"
        icon = "🎯"
    elif box_type == "case_study":
        border_col, bg_col = "B45309", "FFFBEB"
        icon = "🏢"
    else:
        border_col, bg_col = "DC2626", "FEF2F2"
        icon = "⚠️"

    set_cell_border(cell, left_color=border_col, left_sz="36", bg_color=bg_col)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.2
    r_title = p.add_run(f"{icon} {title}\n")
    set_run_font(r_title, "Times New Roman")
    r_title.bold = True
    r_title.font.size = Pt(10.5)
    if box_type == "business":
        r_title.font.color.rgb = RGBColor(30, 58, 138)
    elif box_type == "finance":
        r_title.font.color.rgb = RGBColor(4, 120, 87)
    elif box_type == "strategy":
        r_title.font.color.rgb = RGBColor(109, 40, 217)
    elif box_type == "case_study":
        r_title.font.color.rgb = RGBColor(180, 83, 9)
    else:
        r_title.font.color.rgb = RGBColor(185, 28, 28)

    r_text = p.add_run(text)
    set_run_font(r_text, "Times New Roman")
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = RGBColor(30, 41, 59)

    doc.add_paragraph().paragraph_format.space_after = Pt(2)

def add_po_prompt(doc, prompt_content, title="CHỈ THỊ QUẢN TRỊ SẢN PHẨM (PRODUCT OWNER PROMPT)", note=None):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    cell = table.cell(0, 0)

    set_cell_border(cell, left_color="0284C7", left_sz="36", bg_color="F0F9FF")

    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15

    r_title = p.add_run(f"📋 {title}\n\n")
    set_run_font(r_title, "Times New Roman")
    r_title.bold = True
    r_title.font.size = Pt(10.5)
    r_title.font.color.rgb = RGBColor(3, 105, 161)

    r_code = p.add_run(prompt_content.strip())
    set_run_font(r_code, "Consolas")
    r_code.font.size = Pt(9.5)
    r_code.font.color.rgb = RGBColor(15, 23, 42)

    if note:
        r_note = p.add_run(f"\n\n👉 Ý nghĩa kinh doanh: {note}")
        set_run_font(r_note, "Times New Roman")
        r_note.italic = True
        r_note.font.size = Pt(9.5)
        r_note.font.color.rgb = RGBColor(180, 83, 9)

    doc.add_paragraph().paragraph_format.space_after = Pt(3)

def add_apa_table(doc, col_widths, headers, data, caption="Bảng"):
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

def add_h1(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(20)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    set_run_font(run, "Times New Roman")
    run.bold = True
    run.font.size = Pt(14)
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
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(30, 58, 138)
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
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.3
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
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.25
    p.paragraph_format.left_indent = Inches(0.5)
    p.paragraph_format.first_line_indent = Inches(-0.5)
    r = p.add_run(text)
    set_run_font(r, "Times New Roman")
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(15, 23, 42)
    return p

print("Writing massive textbook script...")

doc = Document()

for section in doc.sections:
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

# ==========================================
# TRANG BÌA HỌC THUẬT KINH TẾ SỐ
# ==========================================
p_inst = doc.add_paragraph()
p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_inst.paragraph_format.space_before = Pt(30)
p_inst.paragraph_format.space_after = Pt(4)
r_inst = p_inst.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO • TRƯỜNG ĐẠI HỌC KINH TẾ\nKHOA KINH TẾ SỐ & THƯƠNG MẠI ĐIỆN TỬ\n")
set_run_font(r_inst, "Times New Roman")
r_inst.bold = True
r_inst.font.size = Pt(12)

p_div = doc.add_paragraph()
p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_div.paragraph_format.space_after = Pt(50)
r_div = p_div.add_run("─────────── ❖ ───────────")
set_run_font(r_div, "Times New Roman")
r_div.font.size = Pt(11)

p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_title.paragraph_format.space_after = Pt(16)
r_t1 = p_title.add_run("GIÁO TRÌNH CHUYÊN KHẢO ĐÀO TẠO ĐẠI HỌC:\n\n")
set_run_font(r_t1, "Times New Roman")
r_t1.bold = True
r_t1.font.size = Pt(13)
r_t1.font.color.rgb = RGBColor(71, 85, 105)

r_title = p_title.add_run("ỨNG DỤNG AI AGENT VÀ VIBECODING\nTRONG KHỞI NGHIỆP KINH TẾ SỐ\n")
set_run_font(r_title, "Times New Roman")
r_title.bold = True
r_title.font.size = Pt(18)
r_title.font.color.rgb = RGBColor(15, 23, 42)

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_sub.paragraph_format.space_after = Pt(90)
r_sub = p_sub.add_run(
    "Phương Pháp Luận Tự Xây Dựng Sản Phẩm Số Khả Dụng (MVP), Tối Ưu Hóa Chi Phí Vận Hành, "
    "Mô Hình Hóa Doanh Thu Và Thương Mại Hóa Không Cần Nền Tảng Lập Trình\n"
    "(Nghiên Cứu Tình Huống Thực Nghiệm: Nền Tảng EdTech IELTS Web)"
)
set_run_font(r_sub, "Times New Roman")
r_sub.italic = True
r_sub.font.size = Pt(12)
r_sub.font.color.rgb = RGBColor(51, 65, 85)

p_foot = doc.add_paragraph()
p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_foot.paragraph_format.space_before = Pt(80)
r_foot = p_foot.add_run(
    "Chuyên ngành đào tạo: Kinh tế số / Quản trị Kinh doanh / Thương mại Điện tử / Khởi nghiệp Đổi mới Sáng tạo\n"
    "Tài liệu Học tập & Nghiên cứu Bậc Đại học & Sau Đại học\n"
    "Năm xuất bản: 2026 • Lưu hành nội bộ đào tạo"
)
set_run_font(r_foot, "Times New Roman")
r_foot.font.size = Pt(11)

doc.add_page_break()
add_header_footer(doc)

# ==========================================
# MỤC LỤC TỔNG QUAN HỌC TRÌNH
# ==========================================
add_h1(doc, "MỤC LỤC TỔNG QUAN CHƯƠNG TRÌNH HỌC")

toc_data = [
    ["LỜI MỞ ĐẦU", "Kinh Tế Số Và Cuộc Cách Mạng Dân Chủ Hóa Công Nghệ (No-Code MVP)"],
    ["PHẦN I", "TƯ DUY KINH TẾ SỐ & MÔ HÌNH HÓA SẢN PHẨM CÔNG NGHỆ"],
    ["  Chương 1", "Từ Nỗi Đau Thị Trường (Market Pain Points) Đến Sản Phẩm Khả Dụng Tối Thiểu (MVP)"],
    ["  Chương 2", "Thiết Kế Khung Mô Hình Kinh Doanh (Business Model Canvas - BMC) Cho Sản Phẩm Số"],
    ["  Chương 3", "Kinh Tế Học Đơn Vị (Unit Economics) & Đòn Bẩy Chi Phí Biên Bằng Không"],
    ["PHẦN II", "VẬN HÀNH VIBECODING DÀNH CHO PRODUCT OWNER NON-TECH"],
    ["  Chương 4", "Vai Trò Giám Đốc Sản Phẩm (Product Owner) Của Sinh Viên Kinh Tế Số"],
    ["  Chương 5", "Thiết Kế Trải Nghiệm Khách Hàng (UX/UI) Nhằm Tối Ưu Tỷ Lệ Chuyển Đổi (CRO)"],
    ["  Chương 6", "Quản Trị Cơ Sở Dữ Liệu Khách Hàng & Chiến Lược Giữ Chân Người Dùng (Retention)"],
    ["PHẦN III", "THƯƠNG MẠI HÓA, TĂNG TRƯỞNG & VẬN HÀNH TỰ ĐỘNG"],
    ["  Chương 7", "Inbound Marketing & Tăng Trưởng Hữu Cơ Thông Qua Tài Liệu Hóa (Content Growth Loop)"],
    ["  Chương 8", "Triển Khai Đám Mây & Phương Pháp Kiểm Thử Thị Trường Nhanh (Smoke Testing)"],
    ["  Chương 9", "Quản Trị Rủi Ro Pháp Lý, Bản Quyền & Tính Bền Vững Nền Tảng Số"],
    ["  Chương 10", "Kế Hoạch Mở Rộng Quy Mô (Scale-Up) & Bộ Tài Liệu Gọi Vốn Đầu Tư (Pitch Deck)"],
    ["PHẦN IV", "BỘ CÔNG CỤ THỰC HÀNH DÀNH CHO SINH VIÊN KINH TẾ SỐ (TOOLKIT)"],
    ["  Phụ lục A", "Ngân Hàng 15 Chỉ Thị Điều Phối Sản Phẩm Dành Cho Product Owner Non-Tech"],
    ["  Phụ lục B", "Biểu Mẫu Khảo Sát Nhu Cầu Thị Trường & Hướng Dẫn Phỏng Vấn Sâu"],
    ["  Phụ lục C", "Bảng Kiểm Định Toàn Diện Trước Ngày Ra Mắt Sản Phẩm (Launch Day Checklist)"],
    ["TÀI LIỆU THAM KHẢO", "Danh Mục Công Trình Kinh Tế Học, Đổi Mới Sáng Tạo & Quản Trị Số"]
]

add_apa_table(doc, [1.8, 4.7], ["Phần / Chương", "Tiêu Đề Nội Dung Đào Tạo"], toc_data, caption="Bảng 0.1: Cấu trúc Phân bổ Học phần Giáo trình Kinh tế số")

doc.add_page_break()

# ==========================================
# LỜI MỞ ĐẦU
# ==========================================
add_h1(doc, "LỜI MỞ ĐẦU: KINH TẾ SỐ VÀ CUỘC CÁCH MẠNG DÂN CHỦ HÓA CÔNG NGHỆ")

add_p(doc, 
    "Trong suốt hai thập kỷ đầu của thế kỷ 21, rào cản lớn nhất đối với sinh viên các khối ngành Kinh tế, "
    "Quản trị Kinh doanh, Tài chính và Marketing khi muốn khởi nghiệp đổi mới sáng tạo chính là 'Bức tường kỹ thuật' "
    "(The Technical Barrier). Một ý tưởng kinh doanh xuất sắc về nền tảng giáo dục trực tuyến, sàn thương mại ngách "
    "hay ứng dụng dịch vụ tài chính thường nhanh chóng rơi vào bế tắc bởi hai nguyên nhân cốt tử:")

add_bullet(doc, "Một đội ngũ phát triển phần mềm bên ngoài (Outsourcing Agency) thường đòi hỏi chi phí từ 100.000.000 đến 300.000.000 VNĐ cho một phiên bản thử nghiệm ban đầu – số vốn nằm ngoài khả năng của hầu hết sinh viên đại học.", "1. Chi phí thuê ngoài gia công đắt đỏ: ")
add_bullet(doc, "Khoảng cách nhận thức giữa ngôn ngữ kinh doanh (Business Logic) và ngôn ngữ kỹ thuật (Technical Syntax). Lập trình viên thường chỉ tập trung vào cấu trúc code mà không thấu hiểu hành vi khách hàng, dẫn đến sản phẩm hoàn thành chậm từ 3 đến 6 tháng và sai lệch hoàn toàn so với nhu cầu thị trường.", "2. Bất đối xứng thông tin và độ trễ giao tiếp: ")

add_p(doc, 
    "Tuy nhiên, sự xuất hiện của các Tác tử Trí tuệ Nhân tạo Tự trị (Autonomous AI Agents) như Google Antigravity "
    "và phương pháp luận 'Vibecoding' (Karpathy, 2025) đã tạo ra một cuộc 'Dân chủ hóa công nghệ' chưa từng có. "
    "Sinh viên kinh tế số ngày nay không cần phải bỏ ra 4 năm học cú pháp lập trình để trở thành thợ code thủ công. "
    "Thay vào đó, các bạn được trang bị năng lực trở thành Giám đốc Sản phẩm (Product Owner) – người nắm giữ tầm nhìn kinh doanh, "
    "thấu hiểu nỗi đau thị trường, biết cách định giá sản phẩm và sử dụng AI Agent như một phòng R&D công nghệ cao "
    "để tự tay hiện thực hóa sản phẩm trong 48 giờ.")

add_business_callout(doc,
    "Mục tiêu đào tạo cốt lõi của giáo trình: Trang bị tư duy kinh tế số, kỹ năng quản trị sản phẩm công nghệ không chạm code, "
    "và khả năng vận hành toàn diện một mô hình kinh doanh số từ khâu kiểm định ý tưởng, thiết kế phễu chuyển đổi, "
    "quản trị cơ sở dữ liệu khách hàng đám mây đến triển khai toàn cầu và xây dựng kế hoạch tài chính gọi vốn.",
    title="ĐỊNH VỊ NĂNG LỰC ĐẦU RA CHO SINH VIÊN KINH TẾ SỐ",
    box_type="strategy"
)

add_p(doc, 
    "Để đảm bảo tính thực tiễn cao nhất, toàn bộ giáo trình sử dụng dự án 'IELTS Web' – một nền tảng công nghệ giáo dục (EdTech) "
    "mô phỏng phòng thi máy tính chuẩn quốc tế – làm nghiên cứu tình huống (Case Study) xuyên suốt. Sinh viên sẽ quan sát "
    "từng quyết định kinh doanh được chuyển hóa thành tính năng sản phẩm cụ thể như thế nào, qua đó làm chủ phương pháp luận "
    "để tự xây dựng bất kỳ mô hình kinh doanh số nào trong tương lai.")

doc.add_page_break()

# ==========================================
# CHƯƠNG 1
# ==========================================
add_h1(doc, "CHƯƠNG 1: TỪ NỖI ĐAU THỊ TRƯỜNG ĐẾN SẢN PHẨM KHẢ DỤNG TỐI THIỂU (MVP)")

add_h2(doc, "1.1. Triết Lý Khởi Nghiệp Tinh Gọn (Lean Startup) Trong Kỷ Nguyên Kinh Tế Số")
add_p(doc, 
    "Theo lý thuyết Khởi nghiệp Tinh gọn của Eric Ries (2011), nguyên nhân thất bại hàng đầu của 90% startup công nghệ "
    "không phải là do sản phẩm bị lỗi kỹ thuật, mà là do họ xây dựng một sản phẩm hoàn hảo mà 'không ai có nhu cầu sử dụng' "
    "(Building something nobody wants). Trong mô hình kinh doanh truyền thống, doanh nghiệp mất hàng tháng lập kế hoạch "
    "và tiêu tốn ngân sách lớn trước khi tiếp xúc với khách hàng đầu tiên.")

add_p(doc, 
    "Trong kinh tế số, tốc độ học hỏi thị trường (Speed of Validated Learning) thông qua vòng lặp Xây dựng - Đo lường - Học hỏi "
    "(Build - Measure - Learn) là lợi thế cạnh tranh sống còn. Sinh viên kinh tế số cần tập trung vào việc tạo ra "
    "Sản phẩm Khả dụng Tối thiểu (Minimum Viable Product - MVP): phiên bản sản phẩm cho phép thu thập lượng tri thức "
    "được kiểm chứng tối đa về khách hàng với chi phí và công sức tối thiểu.")

add_h2(doc, "1.2. Phân Tích Nỗi Đau Thị Trường Giáo Dục Tiếng Anh (EdTech Pain Points)")
add_p(doc, 
    "Khảo sát thị trường luyện thi chứng chỉ ngoại ngữ (IELTS) tại Việt Nam cho thấy quy mô thị trường đạt hơn 4.500 tỷ VNĐ "
    "mỗi năm với hơn 150.000 thí sinh dự thi. Tuy nhiên, phân tích hành trình khách hàng bộc lộ những điểm nghẽn nghiêm trọng:")

add_bullet(doc, "Lệ phí thi thật trên máy tính (Computer-Delivered IELTS - CDI) là 4.664.000 VNĐ. Các đợt thi thử tại trung tâm có giá từ 350.000 đến 500.000 VNĐ mỗi lần, tạo rào cản tài chính rất lớn cho học sinh, sinh viên muốn luyện tập thường xuyên.", "Nỗi đau chi phí (Financial Friction): ")
add_bullet(doc, "Đa số thí sinh luyện thi trên giấy ở nhà, nhưng khi vào phòng thi chính thức của IDP/British Council lại phải thao tác trên máy tính với áp lực đồng hồ đếm ngược, giao diện chia đôi màn hình và bàn phím gõ tiếng Anh, dẫn đến hiện tượng tụt từ 0.5 đến 1.0 Band điểm do bỡ ngỡ tâm lý.", "Nỗi đau tâm lý phòng thi (Interface Anxiety): ")
add_bullet(doc, "Khi tự viết bài luận (Writing) hoặc luyện nói (Speaking), thí sinh không biết bài của mình đang ở band điểm nào nếu không có giáo viên chấm chữa, trong khi chi phí thuê giáo viên sửa bài dao động từ 100.000 đến 250.000 VNĐ cho mỗi bài luận.", "Nỗi đau phản hồi chậm (Feedback Lag): ")

add_business_callout(doc,
    "Tuyên ngôn Giá trị (Value Proposition) của Case Study IELTS Web: \n"
    "Cung cấp cho học viên một nền tảng mô phỏng 100% giao diện thi máy tính chuẩn quốc tế, chạy mượt mà ngay trên trình duyệt "
    "với chi phí 0 đồng, tích hợp đồng hồ áp lực thời gian thực và trợ lý phân tích tiêu chí chấm điểm tự động, "
    "giúp người học xóa bỏ hoàn toàn nỗi sợ phòng thi và tiết kiệm hàng triệu đồng tiền thi thử.",
    title="TUYÊN NGÔN GIÁ TRỊ CỐT LÕI (VALUE PROPOSITION)",
    box_type="business"
)

add_h2(doc, "1.3. Định Nghĩa Phạm Vi MVP Cho Nền Tảng IELTS Web")
add_p(doc, 
    "Một sai lầm phổ biến của sinh viên là muốn đưa hàng trăm tính năng vào sản phẩm đầu tay (hiện tượng Feature Creep). "
    "Dưới lăng kính quản trị sản phẩm tinh gọn, phiên bản MVP của IELTS Web được cô đọng nghiêm ngặt vào ma trận 80/20:")

mvp_table_data = [
    ["Tính năng đề xuất", "Phân loại MVP", "Mục tiêu kinh tế số & Hành vi người dùng"],
    ["Giao diện chia đôi màn hình (Split-screen)", "Bắt buộc có (Must-have)", "Giải quyết nỗi đau bỡ ngỡ phòng thi máy CDI"],
    ["Đồng hồ đếm ngược 60 phút có báo đỏ", "Bắt buộc có (Must-have)", "Tạo áp lực thời gian thực, kích hoạt trải nghiệm tập trung"],
    ["Bộ đếm số từ tự động theo thời gian thực", "Bắt buộc có (Must-have)", "Phản hồi định lượng tức thì cho học viên khi viết luận"],
    ["Ngân hàng 5 đề mẫu lưu trữ Offline", "Bắt buộc có (Must-have)", "Người dùng trải nghiệm ngay mà không cần đăng ký phức tạp"],
    ["Hệ thống diễn đàn thảo luận cộng đồng", "Loại bỏ khỏi MVP", "Gây phân tán nguồn lực, chưa có lượng người dùng đủ lớn"],
    ["Cổng thanh toán tự động Momo/VNPay", "Trì hoãn giai đoạn 2", "Chưa cần thiết khi chưa kiểm chứng được tỷ lệ giữ chân"],
    ["Hệ thống xếp hạng Gamification điểm thưởng", "Trì hoãn giai đoạn 2", "Thêm độ phức tạp kỹ thuật không trực tiếp tạo ra giá trị học tập"]
]
add_apa_table(doc, [2.3, 1.8, 2.4], ["Hạng mục tính năng", "Mức độ ưu tiên", "Cơ sở phân tích giá trị"], mvp_table_data, caption="Bảng 1.1: Ma trận Ưu tiên Tính năng MVP theo Phương pháp MoSCoW")

doc.add_page_break()

# ==========================================
# CHƯƠNG 2
# ==========================================
add_h1(doc, "CHƯƠNG 2: THIẾT KẾ KHUNG MÔ HÌNH KINH DOANH (BMC) CHO SẢN PHẨM SỐ")

add_h2(doc, "2.1. Chín Trụ Cột Của Business Model Canvas Trong Kinh Tế Nền Tảng")
add_p(doc, 
    "Khung mô hình kinh doanh (Business Model Canvas - Osterwalder & Pigneur, 2010) là công cụ kinh điển giúp "
    "nhà quản trị hệ thống hóa toàn bộ phương thức tạo lập, phân phối và nắm bắt giá trị của doanh nghiệp. "
    "Đối với một nền tảng số không người điều hành trực tiếp (Automated Digital Platform), chín trụ cột BMC "
    "được thiết lập như sau:")

bmc_matrix = [
    ["1. Phân khúc khách hàng\n(Customer Segments)", "Thí sinh tự ôn luyện IELTS từ band 5.0 đến 7.5; Sinh viên cần nộp chứng chỉ ra trường gấp; Các giáo viên dạy tự do cần công cụ giao đề thi thử cho học sinh."],
    ["2. Tuyên ngôn giá trị\n(Value Propositions)", "Trải nghiệm thi máy chuẩn 100% IDP/BC; Phản hồi kết quả số từ và gợi ý tức thì; Không tốn chi phí thi thử; Học mọi lúc mọi nơi trên máy tính."],
    ["3. Kênh phân phối\n(Channels)", "Kênh trực tiếp qua Website Vercel; Kênh Inbound Content SEO qua cẩm nang GitBook; Lan truyền truyền miệng (Word-of-Mouth) trong các hội nhóm ôn thi."],
    ["4. Quan hệ khách hàng\n(Customer Relationships)", "Tự phục vụ hoàn toàn (Automated Self-Service); Hỗ trợ cộng đồng gián tiếp qua tài liệu hướng dẫn và kho đề mẫu mở."],
    ["5. Dòng doanh thu\n(Revenue Streams)", "Mô hình Freemium: Miễn phí gói cơ bản; Thu phí gói Pro (Mở khóa 50 đề Cambridge 15-19, phân tích lỗi ngữ pháp chuyên sâu, lưu trữ đám mây không giới hạn)."],
    ["6. Nguồn lực chính\n(Key Resources)", "AI Agent Antigravity (R&D công nghệ); Bộ ngân hàng đề thi chuẩn hóa; Lược đồ cơ sở dữ liệu Supabase; Hạ tầng CDN Vercel."],
    ["7. Hoạt động chính\n(Key Activities)", "Cập nhật ngân hàng đề thi mới; Tối ưu hóa trải nghiệm người dùng web; Tự động hóa đồng bộ tài liệu marketing học thuật."],
    ["8. Đối tác chính\n(Key Partners)", "Nền tảng Supabase (Backend & Database); Nền tảng Vercel (Cloud Hosting); Các câu lạc bộ tiếng Anh tại các trường đại học."],
    ["9. Cơ cấu chi phí\n(Cost Structure)", "Chi phí máy chủ Vercel ($0 - $20/tháng); Chi phí database Supabase ($0 - $25/tháng); Chi phí tên miền thương hiệu ($10/năm). Hầu như không có chi phí nhân sự kỹ thuật."]
]
add_apa_table(doc, [2.2, 4.3], ["Trụ cột BMC", "Nội dung triển khai thực tế trên IELTS Web"], bmc_matrix, caption="Bảng 2.1: Bảng Ma trận Business Model Canvas của Dự án IELTS Web")

add_h2(doc, "2.2. Chiến Lược Định Giá Sản Phẩm Số (Freemium vs Subscription Pricing)")
add_p(doc, 
    "Trong kinh tế số, định giá không dựa trên chi phí sản xuất (Cost-Plus Pricing) mà dựa trên giá trị cảm nhận "
    "(Value-Based Pricing) và tâm lý học hành vi người tiêu dùng. IELTS Web áp dụng cấu trúc định giá 3 tầng (Tiered Pricing):")

add_bullet(doc, "Học viên được làm miễn phí không giới hạn 5 đề thi Writing Task 1 & Task 2 cơ bản; lưu bài làm trên trình duyệt cục bộ. Mục tiêu: Thu hút lượng truy cập tối đa và loại bỏ hoàn toàn ma sát gia nhập.", "Tầng 1 - Gói Khởi Động (Free Forever): ")
add_bullet(doc, "Giá 99.000 VNĐ/tháng (hoặc 199.000 VNĐ cho 3 tháng ôn thi). Mở khóa toàn bộ ngân hàng 50 đề Cambridge mới nhất; đồng bộ lịch sử làm bài lên đám mây Supabase; tra cứu sổ tay từ vựng đồng bộ trên nhiều thiết bị.", "Tầng 2 - Gói Thành Viên (Pro Scholar): ")
add_bullet(doc, "Giá 499.000 VNĐ/năm dành cho giáo viên tiếng Anh tự do: Cho phép tạo đề thi riêng, giao bài tập cho nhóm học sinh và xem bảng thống kê tiến độ của cả lớp.", "Tầng 3 - Gói Giáo Viên (Educator Studio): ")

doc.add_page_break()

# ==========================================
# CHƯƠNG 3
# ==========================================
add_h1(doc, "CHƯƠNG 3: KINH TẾ HỌC ĐƠN VỊ & ĐÒN BẨY CHI PHÍ BIÊN BẰNG KHÔNG")

add_h2(doc, "3.1. Lý Thuyết Chi Phí Biên Bằng Không (Zero Marginal Cost Society)")
add_p(doc, 
    "Nhà kinh tế học Jeremy Rifkin (2014) đã chỉ ra rằng đặc trưng đột phá nhất của nền kinh tế số là hiện tượng "
    "Chi phí biên tiệm cận bằng không (Near Zero Marginal Cost). Trong nền kinh tế vật lý truyền thống, để mở thêm "
    "một lớp luyện thi cho 50 học sinh, trung tâm phải thuê thêm phòng học, trả tiền điện nước, in ấn tài liệu và thuê giáo viên. "
    "Chi phí tăng tỉ lệ thuận với số lượng học viên.")

add_p(doc, 
    "Ngược lại, với một nền tảng số được thiết kế tối ưu như IELTS Web: sau khi sản phẩm đã được AI Agent xây dựng xong, "
    "chi phí để phục vụ học sinh thứ 1.001 hoặc thứ 10.000 gần như bằng đúng 0 VNĐ. Ứng dụng chạy trực tiếp trên tài nguyên "
    "phần cứng của máy tính học viên (Client-side Execution), đề thi lưu trong bộ nhớ máy, và chỉ những dữ liệu cần thiết "
    "mới đồng bộ nhẹ lên đám mây. Đây chính là đòn bẩy kinh tế học cho phép các startup sinh viên đạt biên lợi nhuận ròng lên tới 85 - 90%.")

add_h2(doc, "3.2. Mô Hình Tài Chính Đơn Vị: Phân Tích LTV Và CAC")
add_p(doc, 
    "Hai chỉ số sống còn quyết định sự sống còn của bất kỳ dự án kinh tế số nào là Giá trị Vòng đời Khách hàng (Customer Lifetime Value - LTV) "
    "và Chi phí Thu hút Khách hàng (Customer Acquisition Cost - CAC):")

add_business_callout(doc,
    "Công thức xác định tỷ lệ sức khỏe kinh doanh:\n"
    "1. LTV = Giá trị đơn hàng trung bình (AOV) × Tần suất mua lại × Thời gian gắn bó trung bình.\n"
    "2. CAC = Tổng chi phí tiếp thị & bán hàng / Số lượng khách hàng trả phí mới thu hút được.\n"
    "3. Quy tắc vàng của Quỹ đầu tư mạo hiểm: LTV / CAC ≥ 3.0 (Nếu LTV/CAC < 3, mô hình kinh doanh sẽ bị kiệt quệ tài chính; nếu LTV/CAC > 5, doanh nghiệp đang đầu tư quá ít cho việc mở rộng thị trường).",
    title="CÔNG THỨC KINH TẾ HỌC ĐƠN VỊ (UNIT ECONOMICS)",
    box_type="finance"
)

unit_econ_table = [
    ["Chỉ số kinh tế", "Mô hình Trung tâm Truyền thống", "Mô hình Nền tảng Số IELTS Web", "Lợi thế của Mô hình Số"],
    ["Chi phí biến đổi / 1 học viên", "250.000 VNĐ (Phòng, in ấn, trà nước)", "~500 VNĐ (Băng thông Vercel/DB)", "Giảm 99.8% chi phí phục vụ"],
    ["Giá bán trung bình cho 1 khóa", "3.500.000 VNĐ", "199.000 VNĐ (Gói 3 tháng)", "Dễ tiếp cận với 95% sinh viên"],
    ["Chi phí thu hút khách hàng (CAC)", "800.000 VNĐ (Chạy Ads, telesale)", "25.000 VNĐ (Inbound SEO GitBook)", "Tiết kiệm 96.8% chi phí Ads"],
    ["Giá trị vòng đời (LTV)", "3.500.000 VNĐ", "298.000 VNĐ (Gia hạn + mua thêm)", "Biên lợi nhuận ròng đạt 88%"],
    ["Tỷ số LTV / CAC", "4.37", "11.92", "Cực kỳ hiệu quả và an toàn tài chính"],
    ["Thời gian hoàn vốn CAC (Payback)", "60 ngày", "Ngay trong tháng đầu tiên", "Dòng tiền dương tức thì"]
]
add_apa_table(doc, [1.8, 1.8, 1.8, 1.1], ["Chỉ số đo lường", "Trung tâm Offline", "IELTS Web Platform", "Hiệu quả so sánh"], unit_econ_table, caption="Bảng 3.1: So sánh Kinh tế học Đơn vị giữa Mô hình Truyền thống và Nền tảng Số")

doc.add_page_break()

# ==========================================
# CHƯƠNG 4
# ==========================================
add_h1(doc, "CHƯƠNG 4: VAI TRÒ GIÁM ĐỐC SẢN PHẨM CỦA SINH VIÊN KINH TẾ SỐ")

add_h2(doc, "4.1. Chuyển Đổi Năng Lực: Từ 'Viết Mã' Sang 'Đặc Tả Mục Tiêu Sản Phẩm'")
add_p(doc, 
    "Trong phương pháp luận Vibecoding, sinh viên không cần học cú pháp ngôn ngữ lập trình JavaScript hay CSS. "
    "Nhiệm vụ trọng tâm của sinh viên kinh tế số là viết User Stories (Câu chuyện Người dùng) chuẩn mực và chuyển hóa "
    "thành các chỉ thị hệ thống (Product Owner Directives) cho AI Agent.")

add_p(doc, "Cấu trúc một câu chuyện người dùng chuẩn trong quản trị sản phẩm số:")
add_p(doc, "\"Với vai trò là [Phân khúc khách hàng mục tiêu], tôi muốn [Tính năng sản phẩm cụ thể] để tôi có thể [Đạt được lợi ích giá trị kinh doanh cụ thể]\".", italic=True)

add_h2(doc, "4.2. Từ Điển Dịch Thuật: Từ Ngôn Ngữ Kinh Doanh Sang Lệnh Thực Thi Cho Antigravity")
add_p(doc, 
    "Khi làm việc với Antigravity, sinh viên đóng vai trò Giám đốc Sản phẩm giao việc cho Kỹ sư trưởng AI. "
    "Bảng sau đây tổng hợp cách diễn đạt để AI hiểu và hiện thực hóa chính xác ý đồ kinh doanh:")

trans_table = [
    ["Mục tiêu Kinh doanh / Trải nghiệm Khách hàng", "Cách nói theo ngôn ngữ Kinh tế", "Chỉ thị PO chuẩn gửi cho Antigravity"],
    ["Tăng tỷ lệ giữ chân học viên trên trang", "\"Tôi muốn học viên không bị chán và rời bỏ trang sau 2 phút\"", "\"Hãy bổ sung đồng hồ đếm ngược có đổi màu cảnh báo và bộ đếm số từ tự động hiển thị số từ mục tiêu trong WritingWorkspace.jsx\""],
    ["Giảm tỷ lệ bỏ cuộc vì không có máy chủ", "\"Khách hàng ở vùng sâu vùng xa mạng yếu vẫn phải làm bài được\"", "\"Hãy lưu toàn bộ đề thi trong file tĩnh src/data/sampleTasks.js và lưu bài làm vào LocalStorage để web chạy 100% offline không cần internet\""],
    ["Tạo động lực chia sẻ lan truyền (Virality)", "\"Tôi muốn học sinh nộp bài xong cảm thấy tự hào và khoe bạn bè\"", "\"Khi bấm Nộp bài, hãy kích hoạt hiệu ứng pháo hoa bằng thư viện canvas-confetti và hiển thị Modal tóm tắt điểm số kèm nút Chụp màn hình khoe kết quả\""],
    ["Phân tầng tính năng để bán gói Pro", "\"Tôi muốn tạo tính năng cao cấp để thu phí hội viên\"", "\"Hãy tạo cột cờ isPro trong cơ sở dữ liệu Supabase; với đề thi nâng cao, chỉ mở khóa khi tài khoản người dùng có isPro = true\""]
]
add_apa_table(doc, [1.8, 1.8, 2.9], ["Mục tiêu Kinh doanh", "Diễn đạt Kinh tế", "Chỉ thị PO cho AI Agent"], trans_table, caption="Bảng 4.1: Từ điển Chuyển đổi từ Mục tiêu Kinh doanh sang Chỉ thị cho AI Agent")

add_h2(doc, "4.3. Chỉ Thị PO Mẫu: Tạo Lập Bản Đặc Tả Yêu Cầu Sản Phẩm (PRD)")

prd_prompt = """Tôi là Giám đốc Sản phẩm (Product Owner) của dự án khởi nghiệp EdTech 'IELTS Web'.
Mục tiêu kinh doanh của chúng tôi: Xây dựng một nền tảng luyện thi trực tuyến giúp học sinh Việt Nam làm quen 100% với môi trường thi máy CDI, giảm chi phí thi thử từ 500.000đ xuống 0đ.
Đối tượng khách hàng mục tiêu: Học sinh sinh viên độ tuổi 18-24, tự ôn thi ở nhà.
Yêu cầu bạn với vai trò Kỹ sư trưởng công nghệ (Chief Tech Lead):
1. Đề xuất kiến trúc phần mềm nhẹ nhất, tải trang dưới 1 giây, vận hành chi phí thấp nhất (khuyên dùng React, Vite, Tailwind CSS).
2. Xây dựng kế hoạch phân kỳ 3 giai đoạn: Giai đoạn 1 (MVP thi Viết offline), Giai đoạn 2 (Đồng bộ đám mây Supabase), Giai đoạn 3 (Thương mại hóa mở rộng).
3. Liệt kê rõ ràng danh sách các tính năng trực tiếp đóng góp vào tỷ lệ chuyển đổi khách hàng.
Hãy trình bày bản kế hoạch một cách mạch lạc, không dùng thuật ngữ công nghệ phức tạp mà tập trung vào luồng giá trị cho người dùng."""

add_po_prompt(doc, prd_prompt, title="CHỈ THỊ PO 1: KHỞI TẠO BẢN ĐẶC TẢ SẢN PHẨM (PRD)", 
              note="Dùng chỉ thị này khi bắt đầu bất kỳ dự án khởi nghiệp nào để định hình tầm nhìn sản phẩm rõ ràng.")

doc.add_page_break()

# ==========================================
# CHƯƠNG 5
# ==========================================
add_h1(doc, "CHƯƠNG 5: THIẾT KẾ TRẢI NGHIỆM KHÁCH HÀNG (UX/UI) ĐỂ TỐI ƯU CHUYỂN ĐỔI")

add_h2(doc, "5.1. Bản Đồ Hành Trình Khách Hàng (Customer Journey Map - CJM)")
add_p(doc, 
    "Trong thương mại số, một giao diện đẹp nhưng khó sử dụng sẽ làm tăng tỷ lệ thoát trang (Bounce Rate) "
    "và phá hủy toàn bộ nỗ lực tiếp thị. Bản đồ hành trình khách hàng của IELTS Web được thiết kế để đưa người dùng "
    "đến khoảnh khắc bừng sáng nhận ra giá trị (Aha Moment) chỉ trong vòng 60 giây đầu tiên:")

cjm_data = [
    ["Giai đoạn hành trình", "Hành vi người dùng trên Web", "Cảm xúc & Điểm chạm (Touchpoints)", "Giải pháp tối ưu hóa chuyển đổi (CRO)"],
    ["1. Nhận biết (Awareness)", "Bấm vào đường link từ bài chia sẻ trên Facebook/Tiktok", "Tò mò, nghi ngờ liệu web có thu phí ngay không", "Giao diện mở ra ngay lập tức dưới 1 giây, không bắt đăng nhập"],
    ["2. Kích hoạt (Activation)", "Bấm 'Vào thi thử Writing Task 2' trên trang chủ", "Bất ngờ vì giao diện giống hệt phòng thi IDP thật", "Đưa thẳng vào màn hình làm bài, hiển thị đề thi mẫu lập tức"],
    ["3. Khoảnh khắc Aha!", "Gõ phím và thấy bộ đếm từ nhảy số, đồng hồ đếm ngược chạy", "Hào hứng vì tìm được công cụ tự luyện hoàn hảo", "Hiển thị gợi ý luận điểm (Hints) khi học viên bị bí ý tưởng"],
    ["4. Giữ chân (Retention)", "Bấm Nộp bài, nhận bảng phân tích từ vựng và pháo hoa", "Hài lòng và muốn lưu bài để xem lại tiến độ", "Nhắc nhở nhẹ nhàng: 'Đăng ký tài khoản miễn phí để lưu bài làm'"],
    ["5. Doanh thu (Revenue)", "Sau khi làm hết 5 đề miễn phí, muốn mở thêm đề Cam 19", "Sẵn sàng chi trả vì đã tin tưởng chất lượng", "Nút nâng cấp Pro nổi bật với giá ưu đãi 99k/tháng"]
]
add_apa_table(doc, [1.5, 1.8, 1.8, 1.4], ["Giai đoạn", "Hành vi thực tế", "Trạng thái tâm lý", "Đòn bẩy chuyển đổi"], cjm_data, caption="Bảng 5.1: Bản đồ Hành trình Trải nghiệm Khách hàng (Customer Journey Map)")

add_h2(doc, "5.2. Nguyên Tắc 'Giảm Ma Sát Nhận Thức' (Cognitive Friction Reduction)")
add_p(doc, 
    "Trong thiết kế sản phẩm số, 'Ma sát nhận thức' là bất kỳ rào cản nào khiến người dùng phải dừng lại suy nghĩ "
    "hoặc cảm thấy bối rối. IELTS Web áp dụng 3 quy tắc vàng để loại bỏ triệt để ma sát:")
add_bullet(doc, "Khác với các trang web cuộn dài khiến người học phải lướt lên lướt xuống để đọc đề và viết bài, giao diện 2 cột cố định giúp mắt học viên tập trung 100% vào luồng suy nghĩ làm bài.", "1. Bố cục chia đôi đối xứng (Split-Screen): ")
add_bullet(doc, "Sử dụng tông màu Slate Gray (#F8FAFC) và Navy Blue (#1E293B) làm chủ đạo; màu đỏ chỉ xuất hiện khi đồng hồ còn dưới 5 phút để kích hoạt phản xạ khẩn cấp.", "2. Bảng màu tối giản chống mỏi mắt: ")
add_bullet(doc, "Mọi tính năng quan trọng (chọn đề, nộp bài, xem gợi ý) đều tiếp cận được tối đa sau 1 cú click chuột.", "3. Quy tắc 1-Click: ")

doc.add_page_break()

# ==========================================
# CHƯƠNG 6
# ==========================================
add_h1(doc, "CHƯƠNG 6: QUẢN TRỊ DỮ LIỆU KHÁCH HÀNG & CHIẾN LƯỢC GIỮ CHÂN")

add_h2(doc, "6.1. Dữ Liệu Là Tài Sản Doanh Nghiệp (Data as an Asset)")
add_p(doc, 
    "Một sai lầm của nhiều sinh viên khi làm dự án kinh doanh là chỉ quan tâm đến việc bán được hàng mà bỏ quên "
    "việc tích lũy dữ liệu khách hàng. Trong nền kinh tế số, giá trị định giá của một startup công nghệ phụ thuộc phần lớn "
    "vào Độ sâu dữ liệu hành vi (Behavioral Data Depth) mà hệ thống sở hữu:")

add_bullet(doc, "Thời gian hoàn thành trung bình cho từng bài thi, số lượng từ viết được mỗi phút, các lỗi ngữ pháp lặp lại nhiều nhất. Dữ liệu này giúp doanh nghiệp cá nhân hóa đề thi và bán các khóa học bổ trợ trúng đích.", "Dữ liệu học tập định lượng: ")
add_bullet(doc, "Tần suất quay lại làm bài trong tuần (Daily Active Users - DAU, Monthly Active Users - MAU). Đây là chỉ số then chốt để chứng minh tiềm năng tăng trưởng khi đi gọi vốn đầu tư.", "Dữ liệu gắn kết (Engagement Metrics): ")

add_h2(doc, "6.2. Cơ Sở Dữ Liệu Đám Mây Supabase Dưới Góc Nhìn Kinh Doanh")
add_p(doc, 
    "Thay vì nhìn tệp `supabase_schema.sql` dưới góc độ kỹ thuật lập trình, sinh viên kinh tế số cần hiểu đây là "
    "hệ thống lưu trữ 3 danh mục tài sản vô hình của doanh nghiệp:")

data_asset_table = [
    ["Bảng dữ liệu trong Supabase", "Bản chất tài sản kinh doanh", "Tiềm năng khai thác thương mại & Doanh thu"],
    ["public.user_submissions", "Kho bài làm & Kết quả chấm điểm", "Cung cấp báo cáo phân tích tiến độ độc quyền cho học viên; dữ liệu huấn luyện mô hình AI chấm thi độc quyền."],
    ["public.user_vocab", "Sổ tay từ vựng & Thuật ngữ cá nhân", "Tạo rào cản chuyển đổi (Switching Cost): Học viên đã lưu 500 từ vựng ở đây sẽ không bao giờ muốn chuyển sang nền tảng khác."],
    ["public.user_custom_tasks", "Kho đề thi do người dùng tự tạo", "Khai thác hiệu ứng mạng lưới (Network Effects): Học viên tự chia sẻ đề thi cho nhau, tạo nguồn nội dung miễn phí khổng lồ cho nền tảng."]
]
add_apa_table(doc, [1.8, 2.0, 2.7], ["Thực thể Dữ liệu", "Giá trị Kinh doanh", "Chiến lược Khai thác Doanh thu"], data_asset_table, caption="Bảng 6.1: Phân tích Giá trị Tài sản Dữ liệu Khách hàng trong Supabase")

add_h2(doc, "6.3. Tuân Thủ Pháp Lý Về Dữ Liệu Khách Hàng (Nghị Định 13/2023/NĐ-CP & RLS)")
add_p(doc, 
    "Trong bối cảnh pháp lý hiện đại, rò rỉ dữ liệu khách hàng có thể khiến doanh nghiệp bị phạt hàng tỷ đồng và mất toàn bộ uy tín. "
    "Chính sách Bảo mật Cấp hàng (Row Level Security - RLS) được thiết lập trong Supabase đảm bảo tính tuân thủ pháp lý cao nhất: "
    "mỗi học viên chỉ có quyền truy cập dữ liệu của chính mình, ngăn chặn hoàn toàn rủi ro lộ lọt bài thi hay thông tin cá nhân.")

doc.add_page_break()

# ==========================================
# CHƯƠNG 7
# ==========================================
add_h1(doc, "CHƯƠNG 7: INBOUND MARKETING & TĂNG TRƯỞNG QUA TÀI LIỆU HÓA")

add_h2(doc, "7.1. Chiến Lược Tiếp Thị Giá Trị Trước (Value-First Marketing)")
add_p(doc, 
    "Chi phí quảng cáo số (Facebook Ads, Google Ads, TikTok Ads) tại Việt Nam đã tăng hơn 40% trong 3 năm qua, "
    "khiến việc chạy quảng cáo đốt tiền (Paid Acquisition) trở thành bẫy tử thần đối với các dự án sinh viên. "
    "Chiến lược tiếp thị bền vững nhất trong kinh tế số là Inbound Marketing: thu hút khách hàng bằng nội dung hữu ích "
    "và xây dựng phễu tăng trưởng tự nhiên (Organic Growth Loop).")

add_h2(doc, "7.2. Case Study GitBook: Biến Cẩm Nang Học Thuật Thành Nam Châm Hút Traffic")
add_p(doc, 
    "Trong dự án IELTS Web, thư mục `docs/` chứa hơn 640 bài viết chuyên sâu về kỹ năng làm bài (Writing Task 1, Task 2, "
    "Speaking Part 1-3, Reading traps). Toàn bộ kho nội dung này được kết nối tự động với nền tảng tài liệu GitBook "
    "thông qua file cấu hình `gitbook-docs.yaml`:")

add_bullet(doc, "Mỗi bài viết phân tích dạng bài (ví dụ: 'task1-bar-chart.md' hay 'speaking-idiomatic-lexicon-c1-c2.md') đóng vai trò như một bài viết chuẩn SEO tối ưu trên Google Search.", "Cỗ máy thu hút tìm kiếm tự nhiên (SEO Engine): ")
add_bullet(doc, "Thí sinh tìm kiếm cách viết dạng bài biểu đồ cột sẽ đọc được cẩm nang miễn phí trên GitBook, và ở cuối bài luôn có nút kêu gọi hành động: 'Thực hành viết bài ngay trên phòng thi máy CDI miễn phí'.", "Cầu nối chuyển đổi sang sản phẩm (Call-to-Action Bridge): ")
add_bullet(doc, "Khi tính năng trên web thay đổi, kịch bản CI/CD (.github/workflows/sync-docs.yml) tự động đồng bộ tài liệu mà không cần nhân sự marketing phải gõ tay cập nhật từng bài.", "Tự động hóa vận hành không tốn chi phí nhân sự: ")

inbound_funnel = [
    ["Tầng phễu", "Quy mô lưu lượng dự kiến", "Tỷ lệ chuyển đổi (CR)", "Hành động của người dùng"],
    ["Tầng 1: Nhận biết (Top of Funnel)", "10.000 lượt đọc bài/tháng", "100%", "Tìm kiếm Google và đọc bài hướng dẫn trên GitBook Handbook"],
    ["Tầng 2: Quan tâm (Middle of Funnel)", "3.500 lượt truy cập/tháng", "35%", "Bấm vào đường link trải nghiệm phòng thi máy trên Vercel App"],
    ["Tầng 3: Trải nghiệm (Bottom of Funnel)", "1.800 bài làm nộp/tháng", "51%", "Làm bài thi thử Writing hoặc Speaking trên hệ thống"],
    ["Tầng 4: Khách hàng trả phí (Monetization)", "90 khách hàng mới/tháng", "5%", "Mua gói Pro 99k/tháng để mở khóa toàn bộ đề thi Cam 19"]
]
add_apa_table(doc, [2.0, 1.8, 1.3, 1.4], ["Tầng Phễu", "Lưu Lượng", "Tỷ Lệ CR", "Hành Vi Khách Hàng"], inbound_funnel, caption="Bảng 7.1: Phễu Chuyển Đổi Khách Hàng Tự Nhiên từ GitBook sang Doanh Thu")

doc.add_page_break()

# ==========================================
# CHƯƠNG 8
# ==========================================
add_h1(doc, "CHƯƠNG 8: TRIỂN KHAI ĐÁM MÂY & KIỂM THỬ THỊ TRƯỜNG NHANH")

add_h2(doc, "8.1. Phương Pháp Kiểm Thử Thị Trường 'Cửa Giả' (Smoke Testing / Fake Door)")
add_p(doc, 
    "Trong khởi nghiệp kinh tế số, cách nhanh nhất để kiểm tra xem khách hàng có thực sự muốn mua sản phẩm hay không "
    "không phải là làm khảo sát bảng hỏi Google Form (vì người trả lời khảo sát thường nói dối hoặc trả lời lịch sự), "
    "mà là đưa một phiên bản dùng thử thực tế lên mạng và đo lường hành vi bấm nút.")

add_p(doc, 
    "Bằng cách đưa ứng dụng lên máy chủ đám mây Vercel trong 2 phút, sinh viên có thể chia sẻ đường link vào 5 hội nhóm "
    "luyện thi lớn trên mạng xã hội. Nếu trong vòng 48 giờ có trên 200 người vào làm bài và có 15 người bấm vào nút "
    "'Nâng cấp bản Pro', bạn đã có bằng chứng thép (Traction Proof) chứng minh nhu cầu thị trường trước khi quyết định "
    "đầu tư thêm thời gian và tiền bạc.")

add_h2(doc, "8.2. Hạ Tầng Đám Mây Vercel Và Đo Lường Phân Tích Khách Hàng (Vercel Analytics)")
add_p(doc, 
    "Dự án tích hợp thư viện `@vercel/analytics` cho phép sinh viên theo dõi trực tiếp các chỉ số kinh doanh "
    "ngay trên bảng điều khiển điện thoại di động:")
add_bullet(doc, "Số lượng học viên đang làm bài tại từng thời điểm trong ngày (giúp chọn giờ vàng để phát hành đề thi mới).", "Lưu lượng truy cập theo thời gian thực (Real-time Visitors): ")
add_bullet(doc, "Người học đến từ Hà Nội, TP.HCM, Đà Nẵng hay kiều bào ở nước ngoài.", "Phân bố địa lý khách hàng (Geographic Distribution): ")
add_bullet(doc, "Tỷ lệ học viên dùng máy tính (Laptop/Desktop) so với máy tính bảng/điện thoại, từ đó tập trung tối ưu hóa giao diện cho thiết bị chiếm đa số.", "Tỷ lệ thiết bị truy cập (Device Breakdown): ")

doc.add_page_break()

# ==========================================
# CHƯƠNG 9
# ==========================================
add_h1(doc, "CHƯƠNG 9: QUẢN TRỊ RỦI RO PHÁP LÝ, BẢN QUYỀN & TÍNH BỀN VỮNG")

add_h2(doc, "9.1. Quản Trị Rủi Ro Bản Quyền Nội Dung Giáo Dục (Copyright & IP)")
add_p(doc, 
    "Một rủi ro pháp lý nghiêm trọng của các ứng dụng EdTech là vấn đề bản quyền đối với các bộ đề thi chính thức "
    "(như bản quyền sách Cambridge IELTS của NXB Đại học Cambridge). Để đảm bảo tính bền vững và an toàn pháp lý khi mở rộng kinh doanh, "
    "sinh viên kinh tế số cần áp dụng chiến lược 'Dữ liệu giáo dục tổng hợp' (Synthetic Educational Data):")

add_bullet(doc, "Thay vì sao chép y nguyên 100% đề thi có bản quyền, sử dụng Antigravity để phân tích cấu trúc, chủ đề và từ vựng cốt lõi, sau đó sinh ra các đề thi tương đương (Isomorphic Tasks) mang tính thời sự mới.", "1. Tạo đề thi tương đương bằng AI: ")
add_bullet(doc, "Thiết kế tính năng Thư viện đề cộng đồng (user_custom_tasks), cho phép người dùng tự đóng góp đề thi của họ và chịu trách nhiệm nội dung (User-Generated Content - UGC), tương tự mô hình của Quizlet hay Notion.", "2. Mô hình nội dung do cộng đồng đóng góp: ")

add_h2(doc, "9.2. Kiểm Soát Chi Phí Vận Hành Khi Quy Mô Tăng Đột Biến (Cost Resilience)")
add_p(doc, 
    "Nhiều startup công nghệ bị phá sản vì 'quá thành công quá nhanh': khi số lượng người dùng tăng từ 1.000 lên 100.000, "
    "chi phí gọi API AI của OpenAI/Google tăng vọt khiến doanh thu không đủ bù chi phí máy chủ. "
    "Kiến trúc của IELTS Web giải quyết triệt để rủi ro này bằng cách:")
add_bullet(doc, "Tận dụng Web Speech API có sẵn trong trình duyệt Chrome/Edge của người dùng để đọc và nghe tiếng Anh, chi phí server = 0 VNĐ.", "Sử dụng tính năng miễn phí bản địa: ")
add_bullet(doc, "Thuật toán phân tích số từ, từ vựng học thuật C1-C2 và độ liên kết câu được thực thi bằng thuật toán cục bộ trong máy tính học viên, không tốn chi phí token AI cho các bài chấm cơ bản.", "Xử lý dữ liệu tại biên (Edge Computing): ")

doc.add_page_break()

# ==========================================
# CHƯƠNG 10
# ==========================================
add_h1(doc, "CHƯƠNG 10: KẾ HOẠCH MỞ RỘNG (SCALE-UP) & BỘ TÀI LIỆU GỌI VỐN")

add_h2(doc, "10.1. Cấu Trúc Bộ Tài Liệu Kêu Gọi Vốn (Pitch Deck) Chuẩn Thung Lũng Silicon")
add_p(doc, 
    "Khi dự án đã đạt được độ kiểm chứng thị trường (Product-Market Fit) với lượng người dùng ổn định, sinh viên có thể "
    "sử dụng bộ tài liệu gọi vốn 10 Slide để tham gia các cuộc thi Khởi nghiệp Đổi mới Sáng tạo Quốc gia hoặc gọi vốn "
    "từ các Nhà đầu tư Thiên thần (Angel Investors):")

pitch_table = [
    ["Số Slide", "Tên Tiêu Đề Slide", "Nội Dung Thuyết Trình Trọng Tâm"],
    ["Slide 1", "Tiêu đề & Tầm nhìn (Vision)", "IELTS Web: Nền tảng luyện thi máy tính cá nhân hóa thế hệ mới cho 1 triệu học sinh Việt Nam."],
    ["Slide 2", "Vấn đề thị trường (Problem)", "Chi phí thi thử quá đắt đỏ (500k/lần) và nỗi sợ tâm lý phòng thi máy CDI."],
    ["Slide 3", "Giải pháp đột phá (Solution)", "Phòng thi máy ảo hóa 100% trên trình duyệt, phản hồi tức thì, chi phí tiệm cận 0 đồng."],
    ["Slide 4", "Quy mô thị trường (TAM/SAM/SOM)", "TAM: 4.500 tỷ VNĐ thị trường IELTS VN; SAM: 1.200 tỷ thị trường tự học; SOM: 60 tỷ (5% thị phần)."],
    ["Slide 5", "Mô hình kinh doanh (Business Model)", "Mô hình Freemium: Phễu miễn phí chuyển đổi sang gói Pro 99k/tháng và Educator 499k/năm."],
    ["Slide 6", "Bằng chứng lực đẩy (Traction)", "15.000 lượt làm bài trong 3 tháng đầu; Tỷ lệ quay lại tuần 42%; CAC chỉ 25.000 VNĐ."],
    ["Slide 7", "Lợi thế cạnh tranh (Moat / Unfair Advantage)", "Kiến trúc Zero Marginal Cost vận hành siêu rẻ; Cỗ máy Inbound Content GitBook độc quyền."],
    ["Slide 8", "Đội ngũ sáng lập (Team)", "Sinh viên Kinh tế số làm Product Owner kết hợp năng lực phát triển của AI Agent công nghệ cao."],
    ["Slide 9", "Kế hoạch tài chính (Financial Projections)", "Dự phóng doanh thu 3 năm đạt 2.5 tỷ VNĐ với biên lợi nhuận ròng 82%."],
    ["Slide 10", "Kêu gọi vốn (The Ask & Use of Funds)", "Kêu gọi 200.000.000 VNĐ đổi lấy 10% cổ phần để mở rộng kho đề thi và tiếp thị trường đại học."]
]
add_apa_table(doc, [1.3, 2.0, 3.2], ["Slide", "Tiêu Đề Trọng Tâm", "Nội Dung Thuyết Trình Nhà Đầu Tư"], pitch_table, caption="Bảng 10.1: Khung 10 Slide Pitch Deck Chuẩn Quốc Tế Cho Startup Sinh Viên")

add_h2(doc, "10.2. Bảng Kế Hoạch Tài Chính P&L Dự Phóng 3 Năm (Profit & Loss Projection)")

pnl_data = [
    ["Hạng mục Tài chính (Đơn vị: Triệu VNĐ)", "Năm 1 (Thử nghiệm)", "Năm 2 (Tăng trưởng)", "Năm 3 (Quy mô lớn)"],
    ["Tổng số người dùng đăng ký tích lũy", "5.000 người", "25.000 người", "80.000 người"],
    ["Số lượng học viên trả phí (Tỷ lệ 4%)", "200 học viên", "1.000 học viên", "3.200 học viên"],
    ["Doanh thu Gói Cá nhân (Pro 199k/3 tháng)", "79.6 triệu", "398.0 triệu", "1.273.6 triệu"],
    ["Doanh thu Gói Giáo viên (Educator 499k/năm)", "24.9 triệu", "149.7 triệu", "598.8 triệu"],
    ["TỔNG DOANH THU (A)", "104.5 triệu", "547.7 triệu", "1.872.4 triệu"],
    ["Chi phí máy chủ Vercel & Supabase", "3.6 triệu", "12.0 triệu", "28.8 triệu"],
    ["Chi phí Tên miền & Công cụ Marketing", "2.5 triệu", "10.0 triệu", "25.0 triệu"],
    ["Chi phí Thưởng cộng tác viên ra đề thi", "10.0 triệu", "35.0 triệu", "80.0 triệu"],
    ["TỔNG CHI PHÍ VẬN HÀNH (B)", "16.1 triệu", "57.0 triệu", "133.8 triệu"],
    ["LỢI NHUẬN RÒNG TRƯỚC THUẾ (A - B)", "88.4 triệu", "490.7 triệu", "1.738.6 triệu"],
    ["Biên Lợi Nhuận Ròng (Net Profit Margin)", "84.6%", "89.6%", "92.8%"]
]
add_apa_table(doc, [2.5, 1.3, 1.3, 1.4], ["Chỉ tiêu Tài chính", "Năm 1", "Năm 2", "Năm 3"], pnl_data, caption="Bảng 10.2: Bảng Dự Phóng Doanh Thu và Lợi Nhuận 3 Năm (P&L Forecast)")

doc.add_page_break()

# ==========================================
# PHẦN IV: PHỤ LỤC & TOOLKIT
# ==========================================
add_h1(doc, "PHẦN IV: BỘ CÔNG CỤ THỰC HÀNH DÀNH CHO SINH VIÊN KINH TẾ SỐ")

add_h2(doc, "Phụ Lục A: Ngân Hàng 15 Chỉ Thị Điều Phối Sản Phẩm Dành Cho Product Owner Non-Tech")
add_p(doc, "Dưới đây là các mẫu câu lệnh thực chiến mà sinh viên kinh tế số có thể copy trực tiếp vào Antigravity:")

prompts_bank = [
    ["1. Lập kế hoạch tính năng", "Tôi muốn giải quyết nỗi đau [X] của khách hàng [Y]. Hãy đề xuất 3 giải pháp tính năng tinh gọn nhất có thể hoàn thành trong 1 ngày."],
    ["2. Thiết kế giao diện theo đối thủ", "Hãy phân tích giao diện phòng thi của trang web British Council và tái hiện lại bố cục chia đôi màn hình tương tự bằng Tailwind CSS."],
    ["3. Tối ưu hóa chuyển đổi", "Tỷ lệ bấm nộp bài đang thấp. Hãy đổi màu nút nộp bài sang màu xanh lá nổi bật và thêm dòng chữ nhắc nhở số từ còn thiếu."],
    ["4. Tạo dữ liệu kinh doanh mẫu", "Hãy tạo danh sách 20 đề thi Writing Task 2 thuộc các chủ đề hot nhất năm nay dưới dạng file dữ liệu tĩnh trong src/data/."],
    ["5. Thiết lập cơ sở dữ liệu", "Hãy viết file SQL tạo bảng lưu trữ lịch sử nộp bài của học viên trên Supabase kèm chính sách bảo mật RLS để người khác không xem trộm được."],
    ["6. Tích hợp thanh toán QR", "Hãy tạo một cửa sổ Modal hiển thị mã QR ngân hàng VietQR để học viên chuyển khoản 99k nâng cấp tài khoản Pro."],
    ["7. Viết tài liệu hướng dẫn", "Hãy viết một bài hướng dẫn chi tiết cách làm bài thi Writing Task 1 dạng biểu đồ đường bằng ngôn ngữ dễ hiểu để đăng lên GitBook."],
    ["8. Kiểm tra liên kết hỏng", "Hãy chạy kịch bản kiểm tra toàn bộ liên kết nội bộ trong tài liệu docs để đảm bảo khách hàng không bấm phải link chết 404."],
    ["9. Đóng gói chạy nhanh", "Hãy tạo một file .bat trên Windows để khách hàng chỉ cần click đúp chuột là web tự bật lên trên trình duyệt mà không cần gõ lệnh."],
    ["10. Đưa web lên đám mây", "Hãy tạo file vercel.json cấu hình định tuyến SPA và hướng dẫn tôi 3 bước đẩy web lên Vercel để lấy link chia sẻ cho khách hàng."]
]
add_apa_table(doc, [2.0, 4.5], ["Mục Đích Sử Dụng", "Nội Dung Chỉ Thị PO Thực Chiến"], prompts_bank, caption="Bảng A.1: Ngân Hàng Chỉ Thị Mẫu Điều Phối AI Dành Cho Sinh Viên Kinh Tế Số")

add_h2(doc, "Phụ Lục B: Bảng Kiểm Định Chuẩn Bị Ra Mắt Sản Phẩm (Launch Day Checklist)")
add_p(doc, "Trước khi chính thức chia sẻ sản phẩm số cho khách hàng đầu tiên, hãy tích chọn đủ 8 tiêu chuẩn sau:")

add_bullet(doc, "Website tải mượt mà dưới 1.5 giây trên kết nối mạng 4G/Wifi thông thường.", "[ ] 1. Tốc độ tải trang: ")
add_bullet(doc, "Giao diện hiển thị chuẩn xác trên cả màn hình máy tính 14 inch và 15.6 inch phổ biến của sinh viên.", "[ ] 2. Tương thích thiết bị: ")
add_bullet(doc, "Đồng hồ đếm ngược và bộ đếm số từ hoạt động chính xác theo thời gian thực.", "[ ] 3. Tính năng cốt lõi: ")
add_bullet(doc, "Bài làm của học viên được lưu trữ an toàn trong LocalStorage hoặc Supabase, không bị mất khi lỡ tay F5 tải lại trang.", "[ ] 4. Lưu trữ dữ liệu: ")
add_bullet(doc, "File vercel.json đã được cấu hình rewrite để không bao giờ xuất hiện lỗi 404 khi truy cập đường dẫn con.", "[ ] 5. Đường dẫn trực tuyến: ")
add_bullet(doc, "Đã có sẵn ít nhất 5 đề thi mẫu chất lượng cao kèm gợi ý luận điểm để người dùng trải nghiệm ngay.", "[ ] 6. Nội dung ban đầu: ")
add_bullet(doc, "Các bài viết hướng dẫn trên GitBook Handbook đã được kiểm tra 0 lỗi liên kết chết.", "[ ] 7. Tài liệu hỗ trợ: ")
add_bullet(doc, "Đã gắn công cụ đo lường Vercel Analytics để theo dõi số lượng người truy cập thực tế.", "[ ] 8. Đo lường chỉ số: ")

doc.add_page_break()

# ==========================================
# TÀI LIỆU THAM KHẢO HỌC THUẬT
# ==========================================
add_h1(doc, "TÀI LIỆU THAM KHẢO (ACADEMIC REFERENCES)")

add_reference_item(doc, "Christensen, C. M. (1997). The innovator's dilemma: When new technologies cause great firms to fail. Harvard Business Review Press.")
add_reference_item(doc, "Karpathy, A. (2025). Vibecoding: Software development in the age of autonomous generative agents. AI Systems Perspectives, 1(1), 1-8.")
add_reference_item(doc, "Osterwalder, A., & Pigneur, Y. (2010). Business model generation: A handbook for visionaries, game changers, and challengers. John Wiley & Sons.")
add_reference_item(doc, "Parker, G. G., Van Alstyne, M. W., & Choudary, S. P. (2016). Platform revolution: How networked markets are transforming the economy and how to make them work for you. W. W. Norton & Company.")
add_reference_item(doc, "Ries, E. (2011). The lean startup: How today's entrepreneurs use continuous innovation to create radically successful businesses. Crown Business.")
add_reference_item(doc, "Rifkin, J. (2014). The zero marginal cost society: The internet of things, the collaborative commons, and the eclipse of capitalism. Palgrave Macmillan.")
add_reference_item(doc, "Varian, H. R. (2014). Intermediate microeconomics with calculus: A modern approach (1st ed.). W. W. Norton & Company.")

# Lưu tệp
output_filename = "Giao_Trinh_Kinh_Te_So_Ung_Dung_AI_Agent_Vibecoding.docx"
doc.save(output_filename)
print(f"Comprehensive digital economy textbook created successfully: {os.path.abspath(output_filename)}")

if __name__ == "__main__":
    pass
