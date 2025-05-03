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
} catch (readErr) {
    if (readErr.code === 'ENOENT') {
        console.log(`JSON 文件 ${jsonFilePath} 不存在，将创建一个新的空数组`);
        iconsData = [];
    } else {
        console.error(`读取 JSON 文件时出错:`, readErr);
        return;
    }
}

// 遍历图标目录
try {
    fs.readdirSync(iconsDir).forEach((iconFile) => {
        const iconPath = path.join(iconsDir, iconFile);
        const stats = fs.statSync(iconPath);
        if (stats.isFile() && iconFile.toLowerCase().endsWith('.png')) {
            const iconInfo = {
                name: iconFile,
                // 生成图标文件的相对路径链接
                path: path.join('./icons', iconFile)
            };
            // 检查图标是否已存在于数据中
            const existingIcon = iconsData.find((icon) => icon.name === iconFile);
            if (!existingIcon) {
                iconsData.push(iconInfo);
            }
        }
    });
} catch (dirErr) {
    console.error(`读取图标目录 ${iconsDir} 时出错:`, dirErr);
    return;
}

// 将更新后的数据写入 JSON 文件
try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(iconsData, null, 2));
    console.log('已成功更新 icons.json 文件');
} catch (writeErr) {
    console.error(`写入 JSON 文件时出错:`, writeErr);
}
