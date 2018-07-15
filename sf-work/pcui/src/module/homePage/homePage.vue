<template>
	<section class="hompage">
		<div class="hompage-h1">{{$t('homePageLang.homeTitle')}}</div>
		<hr/>
		<div class="hompage-h2">{{$t('homePageLang.homeDescription')}}</div>
		<ul>
			<li>{{$t('homePageLang.severLearn')}}
				<a href="http://osfp.sf-express.com/#/i?n=j" target="_blank">{{$t('homePageLang.severDoc')}}</a>
			</li>
			<li>{{$t('homePageLang.pcLearn')}}
				<a href="http://osfp.sf-express.com/#/i?n=p" target="_blank">{{$t('homePageLang.pcDoc')}}</a>
			</li>
			<li>{{$t('homePageLang.phoneLearn')}}
				<a href="http://osfp.sf-express.com/#/i?n=m" target="_blank">{{$t('homePageLang.phoneDoc')}}</a>
			</li>
		</ul>
	</section>

</template>

<style type="text/css" scoped>
	.hompage .hompage-h1{
		margin: 20px 0;
		font-size: 24px;
	}
	.hompage .hompage-h2{
		margin: 10px 0;
		font-size: 18px;
	}
	.hompage ul{
		padding-left: 20px ;
	}
	.hompage ul li{
		list-style:circle;
		font-size: 14px;
		line-height: 28px;
	}
</style>