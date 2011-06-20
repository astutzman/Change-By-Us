<?php
/**
 * Template: Header.php 
 *
 * @package WPFramework
 * @subpackage Template
 */
?>
<!DOCTYPE html>
<html class='universe'>
	
<head class='heavens'>
	
	<title><?php semantic_title(); ?></title>
	
	<meta name="description" content=""/>
	<meta name="author" content=""/>
	<meta http-equiv="Content-Type" content="<?php bloginfo( 'html_type' ); ?>; charset=<?php bloginfo('charset'); ?>" />
	<meta name="generator" content="WordPress" />
	
	<link rel="icon" href="/favicon.ico"/>
	<link rel="shortcut icon" href="/favicon.ico"/>
	
	<link rel="stylesheet" href="/static/css/tc.reset.css" type="text/css" media="screen" charset="utf-8" />
	<link rel="stylesheet" href="/static/css/tc.gam.main.css" type="text/css" media="screen" charset="utf-8"/>
	<link rel="stylesheet" href="<?php bloginfo( 'stylesheet_url' ); ?>" type="text/css" media="screen, projection" />
	<link rel="stylesheet" href="<?php echo CSS . '/print.css'; ?>" type="text/css" media="print" />
	
	<!--[if IE]>
	<link rel="stylesheet" href="/static/css/ie/tc.gam.ie.css" type="text/css" media="screen" charset="utf-8"/>
	<![endif]-->
	
	<!--[if lte IE 8]>
	<link rel="stylesheet" href="/static/css/ie/tc.gam.ie8.css" type="text/css" media="screen" charset="utf-8"/>
	<![endif]-->
	
	<!--[if lte IE 7]>
	<link rel="stylesheet" href="/static/css/ie/tc.gam.ie7.css" type="text/css" media="screen" charset="utf-8"/>
	<![endif]-->
	
	<link rel="alternate" type="application/rss+xml" title="<?php bloginfo( 'name' ); ?> RSS Feed" href="<?php bloginfo( 'rss2_url' ); ?>" />
	<link rel="alternate" type="text/xml" title="RSS .92" href="<?php bloginfo( 'rss_url' ); ?>" />
	<link rel="alternate" type="application/atom+xml" title="Atom 0.3" href="<?php bloginfo( 'atom_url' ); ?>" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

	<!-- Theme Hook -->
    <?php if ( is_singular() ) wp_enqueue_script( 'comment-reply' ); // loads the javascript required for threaded comments ?>
	<?php wp_head(); ?>
	
	<script type="text/javascript" src="http://use.typekit.com/mco2pzd.js"></script>
	<script type="text/javascript">try{Typekit.load();}catch(e){}</script>

</head>



<body class="earth <?php semantic_body(); ?>">
	
	<div class='exosphere'>

		<div class='atmosphere'>
			<div class='stratosphere'>
	
				<ul class="navbar clearfix">
					<li class="home nyc">
						<a href="http://nyc.changeby.us"><span>Change by Us NYC</span></a>
					</li>
					<li class="news-about">
						<a href='/'>News</a>
						<a href='http://nyc.changeby.us/about'>About</a>
					</li>
					<li class="divider"></li>
					<li class="search">
						<form action='http://nyc.changeby.us/search' method='GET'>
							<input type='text' name='terms' value="" />
							<input type='submit' value='' class='searchInput' />
						</form>
					</li>
				</ul><!--end navbar-->		

			</div>
		</div>

		<div class='continent blog'>
			<div class='headlands clearfix'>
				<!-- <span class="above-h1 fancy-caps"><span>The</span> Official</span> -->
				<h1><a href="/">Change by Us NYC <span class="unbold">Blog</a></span></h1>
				<!-- <div class="description">
					Updates from Change by Us NYC community projects and all the news from Change by Us NYC <abbr>HQ</abbr>.
				</div> -->
				<div class="search generic-search">
					<form class="searchform" method="get" action="<?php bloginfo( 'url' ); ?>">
						<input class="search" name="s" type="text" value="Search blog..." tabindex="1" />
					    <input class="search-btn rounded-button" type="submit" tabindex="2" name='headlands-search-btn' value='Search'/>
					</form>
				</div>
			</div>
			
			
			<!-- CONTENT HERE -->
			<div class='midlands clearfix'>
				