/**
 * 自动生成的模块配置文件
 */
export const modules = [<%for(var i = 0; i < modulelist.length; i++) {%>
    "<%:=modulelist[i].name%>",<%}%>
]