import fs from "fs"
import path from "path"

function main() {
  console.log("执行脚本================");
// 获取当前工作目录
const currentDir = process.cwd();

// 用于匹配 HTML 文件的正则表达式
const htmlRegex = /\.html$/;

// 插入的脚本标签
const scriptTag = '\n<script src="//cdn.jsdelivr.net/npm/spacingjs" defer></script>\n';
// const scriptTag = '\n<script>123</script>\n';

// 读取当前目录下的所有文件
fs.readdir(currentDir, (err, files) => {
  if (err) {
    return console.error('Failed to list directory contents:', err);
  }
  
  // 过滤出 HTML 文件
  const htmlFiles = files.filter(file => htmlRegex.test(file));

  // 对每个 HTML 文件进行操作
  htmlFiles.forEach(file => {
    const filePath = path.join(currentDir, file);

    // 读取 HTML 文件
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.error(`Failed to read file: ${file}`, err);
      }
      
      // 检查文件是否已包含该脚本
      if (data.includes(scriptTag.trim())) {
        console.log(`The script is already present in ${file}`);
        return;
      }
      
      // 在文件内容末尾添加脚本标签
      let updatedContent = data.trim();
      if (data.includes('</body>')) {
        updatedContent = updatedContent.replace('</body>', `${scriptTag}\n</body>`);
        console.log(`Script tag inserted into ${filePath}`);
      } else {
        console.log(`No </body> tag found in ${filePath}. Skipping.`);
      }

      // 写入更新后的内容
      fs.writeFile(filePath, updatedContent, 'utf8', err => {
        if (err) {
          return console.error(`Failed to write to file: ${file}`, err);
        }
        console.log(`Script tag added to ${file}`);
      });
    });
  });
});
}

export default main;