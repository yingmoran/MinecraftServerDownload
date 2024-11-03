const { createApp } = Vue;

const app = createApp({
    // 数据绑定
    data() {
        return {
            // 版本数据
            versions: null
        };
    },
    // 方法绑定
    methods: {
        /**
         * 获取java版版本库
         * 
         * @author 影
         */
        async getVersion() {
            // 使用axios获取java版版本库
            const response = await axios({
                // 使用get请求json
                method: "get",
                // 请求的url
                url: "https://launchermeta.mojang.com/mc/game/version_manifest.json"
            });
            // 获取返回的版本库
            this.versions = response.data.versions;
        },
        /**
         * 下载服务端
         * 
         * @param {*} url 本版本下的json
         * 
         * @author 影
         */
        async download(url) {
            // 使用axios获取服务端下载地址
            const response = await axios({
                // 使用get请求json
                method: "get",
                // 请求的url
                url: url
            });
            // 服务端下载地址
            const serverUrl = response.data.downloads.server.url;
            // 下载服务端
            window.open(serverUrl);
        }
    },
    // 页面加载时渲染
    mounted() {
        this.getVersion();
    }
});

app.mount('#container');