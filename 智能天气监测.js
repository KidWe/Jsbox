/** 天气监控 
1. 实时天气监控
2. 未来天气预测
3. 恶劣天气预警
*/


const hotSearchApi =
  "https://m.weibo.cn/api/container/getIndex?containerid=106003%26filter_type%3Drealtimehot";
const family = $widget.family;
async function getHotSearch() {
  //    $ui.toast(family);
  let cache = $cache.get("c")
  let resp = await $http.get(hotSearchApi);
  if (requestFailed(resp)) {
      return JSON.parse(cache)
    }

  let data = resp.data.data;

  let hotCards = data.cards[0].card_group;
  let upTime = data.cardlistInfo.starttime;
  //console.log(upTime)
  let c = { hotCards, upTime }
  $cache.set("hot",c)
  return c
}


// 定义城市
let cityInfo = {
    name: '', //城市名
    tmp: '', //气温
    aqi: '', //空气质量指数
    qlty: '', //空气质量
    cond_txt: '', //实况天气状况
    cond_code: '' //实况天气code
}


//  获取位置
function getLocal() { 
    $location.fetch({
        handler: function(resp) {
            let lat = resp.lat
            let lng = resp.lng

            getWeather(lat, lng)
        }
    })
}


//  获取空气质量相关
function getAir(latt, lngg) {
    $http.get({
        url: "https://free-api.heweather.com/s6/air?key=f558ebde23d14301b98973697083949e&location=" +
            latt + "," + lngg + "&lang=zh&unit=m",

        handler: function(resp) {
            if (resp.data.HeWeather6[0].status == 'ok') {
                let data = resp.data.HeWeather6[0]
                cityInfo.aqi = data.air_now_city.aqi //空气质量指数
                cityInfo.qlty = data.air_now_city.qlty //空气质量
                cityInfo.time = new Date().getTime()
                showView()

                $cache.setAsync({
                    key: "Info",
                    value: cityInfo,
                    handler: function(object) {

                    }
                })
            } else {
                someError(resp.data.HeWeather6[0].status)
            }
        }
    })
}


// 界面设计
function showView() {
    $ui.render({
        props: {
            title: cityInfo.name
        },
        views: [{
            type: "list",
            props: {
                data: [{
                    image: {
                        src: 'assets/' + cityInfo.cond_code + '.png'
                    },
                    name: {
                        text: cityInfo.name
                    },
                    tmp: {
                        text: cityInfo.tmp + '°'
                    },
                    txt: {
                        text: cityInfo.cond_txt
                    },
                    qlty: {
                        text: "空气质量：" + cityInfo.qlty
                    },
                    ly: {
                        text: '数据来源：和风天气'
                    }
                }],
                rowHeight: 60,
                separatorHidden: true,
                selectable: false,
                template: [{
                        type: "label",
                        props: {
                            id: "name",
                            font: $font("bold", 18),
                            lines: 1
                        },
                        layout: function(make) {
                            make.center.equalTo(0)
                            make.top.equalTo(20)
                        }
                    },
                    {
                        type: "image",
                        props: {
                            id: "image",
                            bgcolor: $rgba(100, 100, 100, 0),
                        },
                        layout: function(make, view) {
                            make.left.equalTo(40)
                            make.width.equalTo(100)
                        }
                    },
                    {
                        type: "label",
                        props: {
                            id: "tmp",
                            font: $font(44),
                            lines: 1,
                        },
                        layout: function(make) {
                            make.right.equalTo(-20)
                            make.top.equalTo(12)
                        }
                    },
                    {
                        type: "label",
                        props: {
                            id: "txt",
                            font: $font(12),
                            lines: 1,
                        },
                        layout: function(make) {
                            make.left.equalTo($("name"))
                            make.top.equalTo($("name").bottom).offset(5)

                        }
                    },
                    {
                        type: "label",
                        props: {
                            id: "qlty",
                            font: $font(12),
                            lines: 1,
                        },
                        layout: function(make) {
                            make.left.equalTo($("txt"))
                            make.top.equalTo($("txt").bottom).offset(5)
                        }
                    },
                    {
                        type: "label",
                        props: {
                            id: "ly",
                            font: $font(8),
                            lines: 1,
                        },
                        layout: function(make) {
                            make.left.equalTo($("tmp"))
                            make.top.equalTo($("tmp").bottom).offset(1)
                        }
                    },
                ]
            },
            layout: $layout.fill,
        }]
    })
}



module.exports = {
    init: init
}


// widgetInit()

