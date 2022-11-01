/*

Paper.js by W 3.0
 - Medium widget only

*/


// 主函数
// function main() {
// }

const language = "cn" // en or cn

// 数据获取
/*
let resp = await $http.get({
    url: `https://frodo.douban.com/api/v2/calendar/today?apikey=0ab215a8b1977939201640fa14c66bab&date=${timefmt(new Date(), "yyyy-MM-dd")}&alt=json&_sig=tuOyn%2B2uZDBFGAFBLklc2GkuQk4%3D&_ts=1610703479`,
    header: {
        "User-Agent": "api-client/0.1.3 com.douban.frodo/6.50.0"
    }
})

let movie_data = resp.data

*/

const edge_type_label = {
    "en": ["Posts", "Followers", "Following"],
    "cn": ["帖子", "粉丝", "关注"]
}

// $ui.render 底层基于 UIKit 实现，
// $widget.setTimeline 底层基于 SwiftUI 实现。
// 具体方法是  $widget.setTimeline(object) 为桌面小组件提供时间线
//             $widget.reloadTimeline() 手动触发时间线的刷新，是否刷新由系统决定
//             $widget.inputValue 返回当前小组件设置的参数
//             $widget.family 返回当前小组件的尺寸，0 ~ 3 分别表示小、中、大、超大（iPadOS 15）
//             
//
// 尽管我们为小组件设计了类似的语法结构，但两种界面技术的差异决定了之前的知识不能完全平移过来。
// type :指定类型，"text" 展示一段不可编辑的文本；"image" 展示一个图片；"color" ，"gradient" 实现渐变效果；"divider" 分割线；
//                 "hstack" 横向布局；"vstack" 纵向布局；"zstack" 层叠布局； "spacer" 为布局空间增加间距；"hgrid" 横向网格；
//                 "vgrid" 纵向网格；
// props 或 modifiers ：指定相关属性，frame 限定视图和对齐；position 制定视图；offset 指定视图的位置偏移；padding 指定视图的边距；
//                      layoutPriority 指定布局流程中的优先级；cornerRadius 圆角效果；border 边框效果；clipped 是否剪裁边框部分内容；
//                      opacity 半透明；rotationEffect 以弧度角对视图进行旋转；blur 应用高斯模糊效果；color 视图的前景色，例如文字；
//                      background 视图背景颜色；link 指定点击视图后会打开的链接；widgetURL 指定的是点击整个小组件时候打开的链接；
//                      bold 文本粗体；font 字体；lineLimit 指定文本最多支持的行数；minimumScaleFactor 指定了最小可以接受的比例；
//                      resizable 制定图片是否可以被缩放；scaledToFill 图片是否以拉伸并被裁剪的方式填充满父视图；
//                      scaledToFit 图片是否以拉伸并保持内容的方式放入父视图内；accessibilityHidden 图片指定 VoiceOver 是否禁用；
// views 制定其子视图。
$widget.setTimeline({
        render: ctx => {
            //$widget.family = 1
            const family = ctx.family;
            const width  = $widget.displaySize.width
            const height = $widget.displaySize.height
            let share_total = share_data.edge_owner_to_timeline_media.edges

            if (random_post_max > share_total.length) random_post_max = share_total.length

            let current_share = share_total[Random(0, random_post_max - 1)].node
            let display_url = current_share.display_url

            if (random_children_post && current_share.edge_sidecar_to_children) {
                let children = current_share.edge_sidecar_to_children.edges
                display_url = children[Random(0, children.length - 1)].node.display_url
            }

          

            let inline_widget = {
                type: "text",
                props: {
                    text: family < 5 ? share_data.full_name : counters[1],
                    font: $font("bold", 20),
                    light: "#282828",
                    dark: "white",
                    minimumScaleFactor: 0.5,
                    lineLimit: 1
                }
            }

            let medium_widget = {
                type: "hstack",
                props: {
                    alignment: $widget.verticalAlignment.center,
                    spacing: 7.5
                },
                views: [
                    small_widget,
                    {
                        type: "vstack",
                        props: {
                            alignment: $widget.horizontalAlignment.leading,
                            spacing: 13,
                            frame: {
                                width: width - height - 15,
                                height: height
                            },
                            link: "https://www.instagram.com/" + instagram_url.match(/username=(.+)/)[1]
                        },
                        views: [
                            rectangular_widget,
                            {
                                type: "text",
                                props: {
                                    text: share_data.biography,
                                    font: $font(10),
                                    light: "#282828",
                                    dark: "white",
                                    minimumScaleFactor: 0.5,
                                    lineLimit: 3
                                }
                            },
                            {
                                type: "vgrid",
                                props: {
                                    columns: Array(counter_view.concat(type_view).length / 2).fill({
                                        flexible: {
                                            minimum: 10,
                                            maximum: Infinity
                                        }
                                    })
                                },
                                views: counter_view.concat(type_view)
                            }
                        ]
                    },
                    spacerMaker(height, 0)
                ]
            }

            // if (family == 1) return medium_widget
            // $widget.family 返回当前小组件的尺寸，0 ~ 3 分别表示小、中、大、超大（iPadOS 15）
            return family == 3 ? medium_widget : ""
        }
})
