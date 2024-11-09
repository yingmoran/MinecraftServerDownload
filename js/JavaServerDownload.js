/**
 * 页面加载时加载
 */
$(function () {
    getvVersions();
});

/**
 * 获取java版版本库
 */
function getvVersions() {
    $.ajax({
        type: "get",
        url: "https://launchermeta.mojang.com/mc/game/version_manifest.json",
        success: function (versions) {
            // 循环获取到的版本库
            for (let i = 0; i < versions.versions.length; i++) {
                // 当前版本信息
                const version = versions.versions[i];

                // 使用闭包或立即执行函数，确保异步请求时 `version` 保持独立作用域
                (function (currentVersion) {
                    $.ajax({
                        type: "get",
                        url: currentVersion.url,
                        success: function (data) {
                            // 判断版本类型
                            if (currentVersion.type === "release") { // 正式版
                                const release = $("#release");
                                let str = "";
                                str += "<div class='card-text border p-2'>";
                                str += "<p class='fs-5 text-muted'>" + currentVersion.id + "</p>";
                                // 如果 url 中包含服务器下载地址，则添加下载按钮
                                if (hasServerUrl(data)) {
                                    str += "<a class='btn btn-primary' onclick='downloadServer(\"" + data.downloads.server.url + "\")' > 纯净版 </a>";
                                }
                                str += "</div>";
                                release.append(str);
                            } else if (currentVersion.type === "snapshot") {
                                const snapshot = $("#snapshot");
                                let str = "";
                                str += "<div class='card-text border p-2'>";
                                str += "<p class='fs-5 text-muted'>" + currentVersion.id + "</p>";
                                // 如果 url 中包含服务器下载地址，则添加下载按钮
                                if (hasServerUrl(data)) {
                                    str += "<a class='btn btn-primary' onclick='downloadServer(\"" + data.downloads.server.url + "\")' > 纯净版 </a>";
                                }
                                str += "</div>";
                                snapshot.append(str);
                            } else if (currentVersion.type === "old_alpha") {
                                const oldAlpha = $("#old_alpha");
                                let str = "";
                                str += "<div class='card-text border p-2'>";
                                str += "<p class='fs-5 text-muted'>" + currentVersion.id + "</p>";
                                // 如果 url 中包含服务器下载地址，则添加下载按钮
                                if (hasServerUrl(data)) {
                                    str += "<a class='btn btn-primary' onclick='downloadServer(\"" + data.downloads.server.url + "\")' > 纯净版 </a>";
                                }
                                str += "</div>";
                                oldAlpha.append(str);
                            } else if (currentVersion.type === "old_beta") {
                                const oldBeta = $("#old_beta");
                                let str = "";
                                str += "<div class='card-text border p-2'>";
                                str += "<p class='fs-5 text-muted'>" + currentVersion.id + "</p>";
                                // 如果 url 中包含服务器下载地址，则添加下载按钮
                                if (hasServerUrl(data)) {
                                    str += "<a class='btn btn-primary' onclick='downloadServer(\"" + data.downloads.server.url + "\")' > 纯净版 </a>";
                                }
                                str += "</div>";
                                oldBeta.append(str);
                            }
                        }
                    });
                })(version);
            }
        },
        error: function () {
            alert("服务器异常, 请联系管理员");
        }
    });
}

/**
 * 判断json路径中是否包含服务器下载地址
 * @param json json字符串
 * @returns {boolean} 是否存在这个地址
 */
function hasServerUrl(json) {
    return json.downloads && json.downloads.server && json.downloads.server.url;
}

/**
 * 下载服务端
 * @param url 服务端下载地址
 */
function downloadServer(url) {
    window.location.href = url;
}