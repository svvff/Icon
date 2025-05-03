const fs = require('fs');
const path = require('path');
const moment = require('moment'); // 需要安装 moment 库来处理时间，npm install moment

// 你的 GitHub 账户名（小写）
const yourGitHubUsername ='svvff';
// 图标文件所在目录
const iconsDir = 'icons';
// JSON 文件路径
const jsonFilePath = 'icons.json';
// GitHub 仓库 raw 地址（需替换为你的仓库实际地址）
const baseUrl = `https://raw.githubusercontent.com/${yourGitHubUsername}/Icon/main/${iconsDir}/`;

// 读取现有 JSON 文件内容
let jsonData = {};
try {
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    jsonData = JSON.parse(jsonContent);
    if (!Array.isArray(jsonData.icons)) {
        jsonData.icons = [];
    }
} catch (readErr) {
    if (readErr.code === 'ENOENT') {
        console.log(`JSON 文件 ${jsonFilePath} 不存在，将创建一个新的空对象`);
        jsonData = {
            "name": "Icon",
            "description": yourGitHubUsername,
            "time": "",
            "icons": []
        };
    } else {
        console.error(`读取 JSON 文件时出错:`, readErr);
        return;
    }
}

// 获取当前时间并格式化
const currentTime = moment().format('YYYY-MM-DD');

// 遍历图标目录，仅处理.png 文件
try {
    fs.readdirSync(iconsDir).forEach((iconFile) => {
        const iconPath = path.join(iconsDir, iconFile);
        const stats = fs.statSync(iconPath);

        // 检查是否为文件且以.png 结尾（不区分大小写）
        if (stats.isFile() && iconFile.toLowerCase().endsWith('.png')) {
            const iconInfo = {
                name: iconFile.replace('.png', ''), // 去掉文件名的.png 后缀
                url: baseUrl + iconFile
            };

            // 检查图标是否已存在（避免重复添加）
            const existingIcon = jsonData.icons.find((icon) => icon.name === iconInfo.name);
            if (!existingIcon) {
                jsonData.icons.push(iconInfo);
            }
        }
    });
} catch (dirErr) {
    console.error(`读取图标目录 ${iconsDir} 时出错:`, dirErr);
    return;
}

// 更新时间字段
jsonData.time = currentTime;

// 将更新后的数据写入 JSON 文件（缩进 2 个空格，便于阅读）
try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
    console.log(`成功更新 ${jsonData.icons.length} 个图标到 ${jsonFilePath}`);
} catch (writeErr) {
    console.error(`写入 JSON 文件时出错:`, writeErr);
}
