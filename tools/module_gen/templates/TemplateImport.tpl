<%for(var i = 0; i < importlist.length; i++) {%>import <%:=importlist[i].name%> from "./<%:=importlist[i].name%>";
<%}%>
