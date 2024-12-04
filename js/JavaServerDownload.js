const app = Vue.createApp({
    data() {
        return {
            versions: [], // 原始版本列表
            typeLabels: { // 版本类型的中文标签
                release: "正式版下载框",
                snapshot: "预览版下载框",
                old_alpha: "Alpha版下载框",
                old_beta: "Beta版下载框"
            }
        };
    },
    computed: {
        // 按类型分类版本
        categorizedVersions() {
            return this.versions.reduce((acc, version) => {
                if (!acc[version.type]) acc[version.type] = [];
                acc[version.type].push(version);
                return acc;
            }, {});
        }
    },
    methods: {
        // 获取版本列表
        fetchVersions() {
            fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")
                .then(response => response.json())
                .then(data => {
                    const versionPromises = data.versions.map(this.fetchVersionDetails);
                    return Promise.all(versionPromises);
                })
                .then(versions => {
                    this.versions = versions;
                })
                .catch(() => {
                    alert("加载版本信息时出错，请联系管理员");
                });
        },
        // 获取单个版本的详细信息
        fetchVersionDetails(version) {
            return fetch(version.url)
                .then(response => response.json())
                .then(data => ({
                    id: version.id,
                    type: version.type,
                    serverUrl: data.downloads?.server?.url || null
                }))
                .catch(() => {
                    console.error(`无法加载版本 ${version.id} 的详细信息`);
                    return null;
                });
        },
        // 下载服务端
        downloadServer(url) {
            window.location.href = url;
        }
    },
    mounted() {
        this.fetchVersions(); // 初始化时加载版本信息
    }
});

app.mount('#app');