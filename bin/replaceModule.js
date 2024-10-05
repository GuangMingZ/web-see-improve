#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const packagesDir = path.resolve(__dirname, '../', 'packages');

const MODULE_PATH = process.env.MODULE_PATH || 'src/index.ts';

// 读取packages目录下的所有文件夹
fs.readdir(packagesDir, (err, directories) => {
  if (err) {
    console.error('Error reading the packages directory:', err);
    return;
  }

  directories.forEach(directory => {
    // package.json文件的路径
    const packageJsonPath = path.join(packagesDir, directory, 'package.json');
    // dist目录的路径
    const distPath = path.join(packagesDir, directory, 'dist');

    // 替换package.json里的module值
    if (fs.existsSync(packageJsonPath)) {
      fs.readFile(packageJsonPath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading package.json in ${directory}:`, err);
          return;
        }

        let packageJson;
        try {
          packageJson = JSON.parse(data);
        } catch (parseErr) {
          console.error(`Error parsing package.json in ${directory}:`, parseErr);
          return;
        }

        // 修改module字段为 MODULE_PATH
        packageJson.module = MODULE_PATH;

        // 将修改后的内容写回package.json文件
        fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', err => {
          if (err) {
            console.error(`Error writing package.json in ${directory}:`, err);
          } else {
            console.log(
              `Updated module field in package.json for ${directory}, value ${MODULE_PATH}`
            );
          }
        });
      });
    }

    // 删除dist文件夹及其内容
    if (fs.existsSync(distPath)) {
      fs.rmdir(distPath, { recursive: true }, (err) => {
        if (err) {
          console.error(`Error deleting dist folder in ${directory}:`, err);
        } else {
          console.log(`Deleted dist folder in ${directory}`);
        }
      });
    }

  });
});
