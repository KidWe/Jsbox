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




function list() {
  return {
    type: "list",
    props: {
      id: "hotList",
      template: template,
      hidden: false,
      rowHeight: 35,
      bgcolor:
        $app.env == $env.today
          ? $color("clear")
          : $device.isDarkMode
          ? $color("black")
          : $color("white"),
      actions: [
        {
          title: "墨客",
          color: $rgb(69, 134, 209),
          handler: function (sender, indexPath) {
            $cache.set("app", "moke");
            let text = "";
            text = /.、([\s\S]*)/g.exec(
              sender.data[indexPath.row].hotTitle.text
            )[1];
            //              console.log(text)
            $app.openURL("moke:///search/statuses?query=" + encodeURI(text));
          }
        },
        {
          title: "微博",
          color: $rgb(246, 22, 31), // default to gray
          handler: function (sender, indexPath) {
            //console.log(sender.data[indexPath.row].label.info);
            $cache.set("app", "weibo");
            $app.openURL(sender.data[indexPath.row].hotContent.info);
          }
        }
      ]
    },
    layout: function (make, view) {
      make.bottom.left.right.inset(0);
      make.top.inset(0);
    },
    events: {
      didSelect: function (sender, indexPath) {
        let url = sender.data[indexPath.row].hotTitle.link;
        console.log(url);
        openSafari(url);
      },
      didLongPress: function (sender, indexPath, data) {
        if ($app.env == $env.app || $app.widgetIndex !== -1) return;
        $app.close();
      },
      pulled: function (sender) {
        $("hotList").data = [];
        inAppInit();
        sender.endRefreshing();
      }
    }
  };
}
function openSafari(url) {
  $safari.open({
    url: url,
    entersReader: false,
    handler: () => {
      $ui.clearToast();
    }
  });
}
const template = {
  props: {
    bgcolor: $color("clear")
  },
  views: [
    {
      type: "label",
      props: {
        id: "hotTitle",
        bgcolor: $color("clear"),
        textColor:
          $app.env == $env.app
            ? $device.isDarkMode
              ? $color("white")
              : $color("black")
            : $device.isDarkMode == true
            ? $color("white")
            : $color("black"),
        align: $align.center,
        font: $font(13)
      },
      layout: function (make, view) {
        make.right.top.bottom.inset(0);
        make.left.inset(0);
      }
    },
    {
      type: "label",
      props: {
        id: "icon",
        bgcolor: $color("clear"),
        text: "热",
        textColor: $color("white"),
        radius: 2,
        font: $font("bold", 11),
        align: $align.center,
        alpha: 0.8,
        hidden: true
      },
      layout: function (make, view) {
        make.right.inset(15);
        make.width.equalTo(15);
        make.height.equalTo(15);
        make.centerY.equalTo();
      },
      events: {
        tapped: function (sender) {}
      }
    }
  ]
};



widgetInit()

