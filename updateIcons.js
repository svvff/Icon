const fs = require('fs');
const path = require('path');

// 图标文件所在目录
const iconsDir = 'icons';
// JSON 文件路径
const jsonFilePath = 'icons.json';

// 读取现有 JSON 文件内容
let iconsData = [];
try {
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    iconsData = JSON.parse(jsonContent);
} catch (err) {
    // 如果文件不存在或解析失败，创建一个空数组
    iconsData = [];
}

// 遍历图标目录
fs.readdirSync(iconsDir).forEach((iconFile) => {
    const iconPath = path.join(iconsDir, iconFile);
    const stats = fs.statSync(iconPath);
    if (stats.isFile()) {
        const iconInfo = {
            name: iconFile
        };
        // 检查图标是否已存在于数据中
        const existingIcon = iconsData.find((icon) => icon.name === iconFile);
        if (!existingIcon) {
            iconsData.push(iconInfo);
        }
    }
});

// 将更新后的数据写入 JSON 文件
fs.writeFileSync(jsonFilePath, JSON.stringify(iconsData, null, 2));
console.log('已成功更新 icons.json 文件');  // 添加这行用于调试输出
