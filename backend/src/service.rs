use pulldown_cmark::{Options, Parser, html};

#[tauri::command]
pub fn markdown_to_html(markdown: &str) -> String {
    // 设置解析选项，启用常用的 Markdown 扩展
    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_FOOTNOTES);
    options.insert(Options::ENABLE_TASKLISTS);
    options.insert(Options::ENABLE_SMART_PUNCTUATION);

    // 创建 Markdown 解析器
    let parser = Parser::new_ext(markdown, options);

    // 将解析结果转换为 HTML
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    html_output
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_markdown() {
        let markdown = "# Heading\n\nThis is a paragraph.";
        let html = markdown_to_html(markdown);
        assert!(html.contains("<h1>Heading</h1>"));
        assert!(html.contains("<p>This is a paragraph.</p>"));
    }

    #[test]
    fn test_bold_and_italic() {
        let markdown = "**bold** and *italic*";
        let html = markdown_to_html(markdown);
        assert!(html.contains("<strong>bold</strong>"));
        assert!(html.contains("<em>italic</em>"));
    }

    #[test]
    fn test_strikethrough() {
        let markdown = "~~strikethrough~~";
        let html = markdown_to_html(markdown);
        assert!(html.contains("<del>strikethrough</del>"));
    }

    #[test]
    fn test_table() {
        let markdown = "| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |";
        let html = markdown_to_html(markdown);
        assert!(html.contains("<table>"));
        assert!(html.contains("<th>"));
        assert!(html.contains("<td>"));
    }

    #[test]
    fn test_task_list() {
        let markdown = "- [ ] Unchecked\n- [x] Checked";
        let html = markdown_to_html(markdown);
        assert!(html.contains("type=\"checkbox\""));
    }
}
