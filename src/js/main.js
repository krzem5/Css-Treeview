function render_tree(tree,rt){
	var PROG_EXT="py js css html java".split(" "),EXEC_EXT="exe bat".split(" ");
	function _r(d,i,p){
		var o="";
		for (var k in d["d"]){
			var tp=p+"/"+k;
			for (var j=0;j<i;j++){
				o+="<span class=\"vl\">&nbsp;&nbsp;&nbsp;&nbsp;</span>";
			}
			o+=(i>0?`<i class=\"material-icons a s\" data-path=\"${tp.substring(1)}\">play_arrow</i>`:"")+`<span class=\"${(i==0?"r":"d")}\">${k}</span><span class=\"o\" data-path=\"${tp.substring(1)}\">:</span>\n<div class=\"go\" data-path=\"${tp.substring(1)}\"><div class=\"g\" data-path=\"${tp.substring(1)}\">${_r(d["d"][k],i+1,tp)}</div></div>`;
		}
		for (var f of d["f"]){
			for (var j=0;j<i;j++){
				o+="<span class=\"vl\">&nbsp;&nbsp;&nbsp;&nbsp;</span>";
			}
			o+=`<span class=\"f\">${((f.indexOf(".")>-1&&EXEC_EXT.includes(f.split(".")[1]))?f.split(".")[0]+"<span class=\"f e\"><span class=\"o\">.</span>"+f.split(".")[1]+"</span>":(f.indexOf(".")>-1?f.split(".")[0]+`<span class=\"o\">.</span><span class=\"f ${f.indexOf(".")>-1&&PROG_EXT.includes(f.split(".")[1])?" p":""}\">${f.split(".")[1]}</span>`:f))}</span>\n`;
		}
		return o;
	}
	function _f(e){
		for (var c of e.children){
			if (c.classList.contains("a")){
				c.l=e.children;
				c.addEventListener("click",function(){
					var p=this.getAttribute("data-path");
					var g;
					for (var c of this.l){
						if (c.getAttribute("data-path")==p){
							c.classList.toggle("s");
							if (c.classList.contains("go")){
								g=c;
							}
						}
					}
					function f(i=0){
						if (i>=200){
							return;
						}
						i++;
						setTimeout(f,0,i);
						var el=g;
						var gr=el.getBoundingClientRect(),gcr=el.children[0].getBoundingClientRect();
						el.style.height=(gcr.height-(gr.y-gcr.y)).toString()+"px";
						while ((el=el.parentNode.parentNode)!=null&&el.classList.contains("go")){
							gr=el.getBoundingClientRect(),gcr=el.children[0].getBoundingClientRect();
							el.style.height=(gcr.height-(gr.y-gcr.y)).toString()+"px";
						}
					}
					setTimeout(f,0);
				});
			}
			if (c.classList.contains("go")){
				c.style.height=c.children[0].offsetHeight.toString()+"px";
				c.children[0].style.width=c.offsetWidth.toString()+"px";
				c.children[0].classList.add("r");
				_f(c.children[0]);
			}
		}
	}
	var d={"d":{},"f":[]};
	for (var s of tree.split(";")){
		s=s.replace("\n|\t|\s","");
		if (s==""){
			continue;
		}
		s=s.split("/");
		var p="";
		for (var dr of s){
			var t=d;
			for (var k of p.substring(1).split("/")){
				if (k==""){
					continue;
				}
				t=t.d[k];
			}
			if (dr==s[s.length-1]){
				t.f.push(dr);
				t.f.sort(function(a,b){
					return a.localeCompare(b);
				});
				continue;
			}
			if (t.d[dr]==undefined){
				t.d[dr]={"d":{},"f":[]};
				var _t=Object.keys(t.d).map(function(k){
					return [k,t.d[k]];
				});
				_t.sort(function(a,b){
					return a[0].localeCompare(b[0]);
				});
				t.d={};
				for (var e of _t){
					t.d[e[0]]=e[1];
				}
			}
			p+=`/${dr}`;
		}
	}
	rt.innerHTML+=`<div class=\"file-view\"><pre class=\"view\">${_r(d,0,"")}</pre></div>`;
	for (var b of rt.querySelectorAll("div.file-view>pre.view")){
		b.style.minWidth=b.offsetWidth+"px";
		b.style.height=b.offsetHeight+"px";
		for (var c of b.children){
			if (c.classList.contains("go")){
				c.style.height=c.children[0].offsetHeight.toString()+"px";
				c.children[0].style.width=c.offsetWidth.toString()+"px";
				c.children[0].classList.add("r");
				_f(c.children[0]);
			}
		}
	}
}