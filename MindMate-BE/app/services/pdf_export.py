from weasyprint import HTML

def export_chat_to_pdf(conversation_title, messages):
    html_content = f"<h1>{conversation_title}</h1><hr>"
    for msg in messages:
        sender = "You" if msg.sender == "user" else "MindMate"
        html_content += f"<p><b>{sender}:</b> {msg.text}</p>"

    pdf_bytes = HTML(string=html_content).write_pdf()
    return pdf_bytes
