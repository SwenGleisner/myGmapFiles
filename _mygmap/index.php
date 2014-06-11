<?php defined( '_JEXEC' ) or die; 
// Alle Template Parameter aus logic.php laden
include_once JPATH_THEMES.'/'.$this->template.'/logic.php'; 
?>
<!doctype html>
<!--[if IEMobile]><html class="iemobile" lang="<?php echo $this->language; ?>"><![endif]-->
<!--[if IE 8]><html class="no-js ie8" lang="<?php echo $this->language; ?>"><![endif]-->
<!--[if gt IE 8]><!-->  <html class="no-js" lang="<?php echo $this->language; ?>"><!--<![endif]-->

<head>
<jdoc:include type="head" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
<link rel="apple-touch-icon-precomposed" href="<?php echo $tpath; ?>/images/apple-touch-icon-57x57-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?php echo $tpath; ?>/images/apple-touch-icon-72x72-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?php echo $tpath; ?>/images/apple-touch-icon-114x114-precomposed.png">
<link rel="apple-touch-icon-precomposed" sizes="144x144" href="<?php echo $tpath; ?>/images/apple-touch-icon-144x144-precomposed.png">
<!--[if lte IE 8]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <?php if ($pie==1) : ?>
      <style> 
        {behavior:url(<?php echo $tpath; ?>/js/PIE.htc);}
      </style>
    <?php endif; ?>
  <![endif]-->
</head>

<body class="<?php echo (($menu->getActive() == $menu->getDefault()) ? ('front') : ('page')).' '.$active->alias.' '.$pageclass; ?>">
<div id="fixedbg"> </div>

<div id="header" class="navbar navbar-default navbar-fixed-top non-printable btn-primary" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button id="tglbtn" type="button" class="navbar-toggle"> 
            	<span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span> 
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <img class="headerlogo" src="templates/_mygmap/images/logo_mygmap.png" width="225" height="75">
        </div>
        <div id="tglpull" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <jdoc:include type="modules" name="header_navigation" style="none" />
            </ul>
        </div>
         
    </div>
</div>

<!-- Begin Content -->
<div id="maincontainer" class="container">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <jdoc:include type="modules" name="position-0" style="none" />
    </div>
    <?php if ($this->countModules( 'position-1' )) : ?>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <jdoc:include type="modules" name="position-1" style="none" />
    </div>
    <?php endif; ?>
    <?php if ($this->countModules( 'position-2' )) : ?>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <jdoc:include type="modules" name="position-2" style="none" />
    </div>
    <?php endif; ?>
    <?php if ($this->countModules( 'position-3' )) : ?>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <jdoc:include type="modules" name="position-3" style="none" />
    </div>
    <?php endif; ?>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <jdoc:include type="component" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="height: 100%;">
        <jdoc:include type="modules" name="position-4" style="none" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <jdoc:include type="modules" name="position-5" style="none" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <jdoc:include type="modules" name="position-6" style="none" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <jdoc:include type="modules" name="position-7" style="none" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <jdoc:include type="modules" name="position-8" style="none" />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
        <jdoc:include type="modules" name="position-9" style="none" />
    </div>
</div>
<!--End Content--> 
<!-- Begin Footer -->
<div id="footer" class="btn-primary">
    <div class="container"><h5>No programmers were harmed in the making of this software! Copyright 2014 GNU/GPL</h5></div>
</div>
<!--End Footer-->

<jdoc:include type="modules" name="debug" style="none" />
</body>
</html>

<script>
var menuHandler = function(){
	jQuery('#tglbtn').click(function(){
		jQuery('#tglpull').toggleClass(" in");
	})
	if(jQuery('#tglbtn').is(":visible") == false){
		jQuery('.nav > li').css('float','left');
		jQuery('.navbar-nav').addClass('pull-right');
	} else {
		jQuery('.nav > li').css('float','');
		jQuery('.navbar-nav').removeClass('pull-right');	
	};
}
jQuery( document ).ready(function() {
	menuHandler();
});
jQuery( window ).resize(function() {
	menuHandler();
});
</script>

