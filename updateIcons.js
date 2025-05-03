const fs = require('fs');
const path = require('path');

// 图标文件所在目录（保持与仓库中的文件夹名称一致，此处为小写 icons）
const iconsDir = 'icons';
// JSON 文件路径
const jsonFilePath = 'icons.json';
// GitHub 仓库 raw 地址（需替换为你的仓库实际地址）
const baseUrl = 'https://raw.githubusercontent.com/svvff/Icon/main/icons/'; 

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

// 遍历图标目录，仅处理 .png 文件
try {
    fs.readdirSync(iconsDir).forEach((iconFile) => {
        const iconPath = path.join(iconsDir, iconFile);
        const stats = fs.statSync(iconPath);
        
        // 检查是否为文件且以 .png 结尾（不区分大小写）
        if (stats.isFile() && iconFile.toLowerCase().endsWith('.png')) {
            const iconInfo = {
                name: iconFile, // 文件名（包含扩展名）
                link: baseUrl + iconFile // 绝对可访问链接
            };
            
            // 检查图标是否已存在（避免重复添加）
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

// 将更新后的数据写入 JSON 文件（缩进 2 个空格，便于阅读）
try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(iconsData, null, 2));
    console.log(`成功更新 ${iconsData.length} 个图标到 ${jsonFilePath}`);
} catch (writeErr) {
    console.error(`写入 JSON 文件时出错:`, writeErr);
}
