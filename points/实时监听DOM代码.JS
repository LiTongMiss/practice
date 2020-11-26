(function SpyOn() {

    const _id = 'spyon-container',
          _posBuffer = 3;
  
    function init() {
      document.body.addEventListener('mousemove', glide);
      document.body.addEventListener('mouseover', show);
      document.body.addEventListener('mouseleave', hide);
    }
  
    function hide(e) {
      document.getElementById(_id).style.display = 'none';
    }
  
    function show(e) {
      const spyContainer = document.getElementById(_id);
      if (!spyContainer) {
        create();
        return;
      }
      if (spyContainer.style.display !== 'block') {
        spyContainer.style.display = 'block';
      }
    }
  
    function glide(e) {
      const spyContainer = document.getElementById(_id);
      if (!spyContainer) {
        create();
        return;
      }
      const left = e.clientX + getScrollPos().left + _posBuffer;
      const top = e.clientY + getScrollPos().top + _posBuffer;
      spyContainer.innerHTML = showAttributes(e.target);
      if (left + spyContainer.offsetWidth > window.innerWidth) {
        spyContainer.style.left = left - spyContainer.offsetWidth + 'px';
      } else {
        spyContainer.style.left = left + 'px';
      }
      spyContainer.style.top = top + 'px';
    }
  
    function getScrollPos() {
      const ieEdge = document.all ? false : true;
      if (!ieEdge) {
        return {
          left : document.body.scrollLeft,
          top : document.body.scrollTop
        };
      } else {
        return {
          left : document.documentElement.scrollLeft,
          top : document.documentElement.scrollTop
        };
      }
    }
  
    function showAttributes(el) {
      const nodeName = `<span style="font-weight:bold;">${el.nodeName.toLowerCase()}</span><br/>`;
      const attrArr = Array.from(el.attributes);
      const attributes = attrArr.reduce((attrs, attr) => {
        attrs += `<span style="color:#ffffcc;">${attr.nodeName}</span>="${attr.nodeValue}"<br/>`;
        return attrs;
      }, '');
      return nodeName + attributes;
    }
  
    function create() {
      const div = document.createElement('div');
      div.id = _id;
      div.setAttribute('style', `
        position: absolute;
        left: 0;
        top: 0;
        width: auto;
        height: auto;
        padding: 10px;
        box-sizing: border-box;
        color: #fff;
        background-color: #444;
        z-index: 100000;
        font-size: 12px;
        border-radius: 5px;
        line-height: 20px;
        max-width: 45%;
        `
      );
      document.body.appendChild(div);
    }
  
    init();
  
  })();
  
  
//   作者：前端先锋
//   链接：https://juejin.im/post/5dc9276a5188251d47166dcc
//   来源：掘金
//   著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

// 你可以从这段代码中学到什么

//     如何使用 Vanilla JS 实现工具提示模块
//     如何解析 DOM 对象的属性
//     如何找到鼠标 X 和 Y 的位置
//     如何获取文档的滚动位置
//     了解不同浏览器的行为方式 —— Edge vs. Chrome vs. Safari
