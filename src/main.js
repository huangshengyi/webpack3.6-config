import css from './css/index.css';

import less from './css/black.less';

import sass from './css/sayi.scss';

// import jQuery from 'jquery'; // 已经在webpack配置中进行引入了

{
    let str = 'hello webpack3.6!!!!9890';
    document.getElementById('title').innerHTML = str;
    jQuery('#title').html(str + '<br/>' + jQuery('#title').html());
    console.log(jQuery);
}
