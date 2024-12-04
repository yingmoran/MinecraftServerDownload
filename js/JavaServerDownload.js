/**
 * 页面加载时执行初始化函数
 */
$(function () {
    getVersions(); // 加载版本信息
});

/**
 * 从Mojang官方API获取Java版版本库信息
 */
function getVersions() {
    $.ajax({
        type: "get", // 使用GET请求
        url: "https://launchermeta.mojang.com/mc/game/version_manifest.json", // Mojang官方的版本库API
        success: function (versions) {
            // 遍历版本库信息，并获取每个版本的详细信息
            const versionPromises = versions.versions.map((version) => fetchVersionDetails(version));

            // 等待所有版本的详细信息加载完毕
            Promise.all(versionPromises).then(() => {
                console.log("所有版本信息已加载完成");
            }).catch(() => {
                alert("加载版本信息时出错，请联系管理员");
            });
        },
        error: function () {
            // 请求版本库失败的错误处理
            alert("服务器异常，请联系管理员");
        }
    });
}

/**
 * 异步获取指定版本的详细信息
 * @param {Object} version - 版本对象，包含版本的id、类型和URL
 * @returns {Promise} 返回一个Promise对象，表示Ajax请求的完成情况
 */
function fetchVersionDetails(version) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get", // 使用GET请求
            url: version.url, // 该版本的详细信息URL
            success: function (data) {
                // 渲染版本卡片
                renderVersionCard(version, data);
                resolve(); // 请求成功，标记Promise为resolved
            },
            error: function () {
                console.error(`无法加载版本 ${version.id} 的详细信息`);
                reject(); // 请求失败，标记Promise为rejected
            }
        });
    });
}

/**
 * 渲染单个版本的卡片信息到页面
 * @param {Object} version - 版本对象，包含版本的id、类型和URL
 * @param {Object} data - 版本的详细数据
 */
function renderVersionCard(version, data) {
    let container; // 根据版本类型选择容器

    // 根据版本类型选择对应的DOM容器
    switch (version.type) {
        case "release":
            container = $("#release"); // 正式版容器
            break;
        case "snapshot":
            container = $("#snapshot"); // 快照版容器
            break;
        case "old_alpha":
            container = $("#old_alpha"); // Alpha版容器
            break;
        case "old_beta":
            container = $("#old_beta"); // Beta版容器
            break;
        default:
            return; // 若版本类型不符合预期，则跳过
    }

    // 构建版本信息的HTML内容
    let str = "<div class='card-text border p-2'>";
    str += "<p class='fs-5 text-muted'>" + version.id + "</p>"; // 显示版本号

    // 如果版本包含服务器下载地址，则添加下载按钮
    if (hasServerUrl(data)) {
        str += "<a class='btn btn-primary btn-lg' onclick='downloadServer(\"" + data.downloads.server.url + "\")'> 纯净版 </a>";
    }
    str += "</div>";

    // 将生成的HTML内容插入到对应容器中
    container.append(str);
}

/**
 * 判断json路径中是否包含服务器下载地址
 * @param {Object} json - JSON对象，包含版本的下载信息
 * @returns {boolean} 是否存在服务器下载地址
 */
function hasServerUrl(json) {
    // 检查对象是否存在服务器下载地址
    return json.downloads && json.downloads.server && json.downloads.server.url;
}

/**
 * 下载服务端文件
 * @param {string} url - 服务端下载地址
 */
function downloadServer(url) {
    // 触发浏览器下载功能，跳转到服务器下载地址
    window.location.href = url;
}
