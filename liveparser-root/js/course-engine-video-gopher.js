//GopherB node Socket setup 
var iosocket;
iosocket = io.connect();
iosocket.emit('HiGopherB','');
iosocket.emit('HiClientServer','');


var GopherCallerIDCouter = 100;
var GopherCallerID = '0:0';
function GopherTell(xCodeLine, xGopherMsg, xParentID, xGopherCallerID) {
 iosocket.emit( 'Gopher.Tell', {CodeLine:xCodeLine, GopherMsg:xGopherMsg, ParentID:xParentID, GopherCallerID:xGopherCallerID } );
}

//------------------------------------------------------------------------------
function GopherUnaryExpr(xCodeLine, xVarStr, xVarValue) {
 xVarValue = !xVarValue;
 iosocket.emit( 'Gopher.GopherUnaryExp', {CodeLine:xCodeLine, VarStr:xVarStr, VarValue:xVarValue, } );
 return xVarValue;
}

//------------------------------------------------------------------------------
function GopherUpdateExpr(xCodeLine, xVarName, xVarValue, xVarOperator, xParentID, xGopherCallerID ) {
 iosocket.emit( 'Gopher.GopherUpdateExp', {CodeLine:xCodeLine, VarName:xVarName, VarValue:xVarValue, VarOperator:xVarOperator,  ParentID:xParentID, GopherCallerID:xGopherCallerID } );
}

//------------------------------------------------------------------------------
function GopherVarDecl(xCodeLine, xVarDeclTrackID, xVarName, xVarValue, xVarStr, xParentID, xGopherCallerID ) {
 iosocket.emit( 'Gopher.VarDecl', {CodeLine:xCodeLine, VarDeclTrackID:xVarDeclTrackID, VarName:xVarName, VarValue:xVarValue, VarStr:xVarStr, ParentID:xParentID, GopherCallerID:xGopherCallerID } );
return xVarValue;
}

//------------------------------------------------------------------------------
function GopherAssignment(xCodeLine, xVarDeclTrackID, xVarName, xVarValue, xVarStr, xParentID, xGopherCallerID, xVarOperator, VarOperator ) {
 iosocket.emit( 'Gopher.GopherAssignment', {CodeLine:xCodeLine, VarDeclTrackID:xVarDeclTrackID, VarName:xVarName, VarValue:xVarValue, VarStr:xVarStr, ParentID:xParentID, GopherCallerID:xGopherCallerID, VarOperator:xVarOperator } );
return xVarValue;
}

//------------------------------------------------------------------------------
function GopherFunctionCall(xCodeLine, xFuncTrackID, xFuncStr, xFuncValue, xParentID, xGopherCallerID) {
 iosocket.emit( 'Gopher.FuncCall', {CodeLine:xCodeLine, FuncTrackID:xFuncTrackID, VarStr:xFuncStr, FuncValue:xFuncValue, ParentID:xParentID, GopherCallerID:xGopherCallerID } );
return xFuncValue;
}

//------------------------------------------------------------------------------


/*
 * IEngine4
 * IEngine4 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2014.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 4.8.11
 */

//------------------------------------------------------------------------------------------------------------------
(function($) {
  var cache = [];
  $.preLoadImages = function() {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = arguments[i];
      cache.push(cacheImage);
    }
  }
})(jQuery)


isThisChrome = function() {
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

isThisSafari = function() {
  return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
}

isThisFirefox = function() {
  return navigator.userAgent.toUpperCase().indexOf('FIREFOX')>=0;
}

isThisMac = function() {
  return navigator.userAgent.toUpperCase().indexOf('MAC')>=0;
}

//------------------------------------------------------------------------------------------------------------------
function loadCourseCssFile(pathToFile) {

if(document.createStyleSheet) {
    try { document.createStyleSheet(pathToFile); } catch (e) { }
}
else {
    var css;
    css         = document.createElement('link');
    css.rel     = 'stylesheet';
    css.type    = 'text/css';
    css.media   = "all";
    css.href    = pathToFile;
    document.getElementsByTagName("head")[0].appendChild(css);
}
/*
	$('link[href="'+pathToFile+'"]').remove();

	var css = jQuery("<link>");
	css.attr({
		rel:  "stylesheet",
		type: "text/css",
		href: pathToFile
	});
	$("head").append(css);
	*/
}


//------------------------------------------------------------------------------------------------------------------
function cleanURL(url) {
    return(url.replace(/\?.*$/, "")
           .replace(/\/[^\/]*\.[^\/]*$/, "")
           .replace(/\/$/, "") + "/");
}

//------------------------------------------------------------------------------------------------------------------
function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


//------------------------------------------------------------------------------------------------------------------
function SearchInArray(xarray,needle) {
	var i = -1, index = -1;

	for(i = 0; i < xarray.length; i++) {
		if(xarray[i] === needle) {
			index = i;
			break;
		}
	}
	return index;
}


//------------------------------------------------------------------------------------------------------------------
var SettingsXML;

var isiPad = false;
var isiPadFirstTimeLoad = false;

var ua = navigator.userAgent.toLowerCase();
var isiPad_ = navigator.userAgent.match(/iPad/i) != null;
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

//treat ipad and andorid the same way
if ((isiPad_) || (isAndroid)) { isiPad = true; isiPadFirstTimeLoad = true; }


var CourseLanguage = getParameterByName("lang");
if (CourseLanguage=="") { CourseLanguage="en"; }

var CourseMode = "Video";

var admin_SkinCSS = "";

var admin_CopyrightInfo = "";
var admin_Version = "";

var admin_URLOnExit = "";

var admin_AutoForwardDefaultSetting = true;
var admin_AutoForwardEnabled = true;
var admin_ForwardBlink = true;

var admin_DisableVolume = false;

var admin_BottomLogo = "";
var admin_TopLogo = "";

var admin_HelpFile = "";
var admin_GlossaryFile = "";
var admin_CourseFile = "";

var admin_ScormOrFinalQuiz = "";
var admin_RetakeFinalExam = "";

var admin_Submit = "";
var admin_Finish = "";
var admin_Help = "";
var admin_Glossary = "";
var admin_SaveAndExit = "";
var admin_Review = "";
var admin_ReviewMode = false;

var admin_VideoProgress = true;
var admin_VideoProgressCanMove = true;

var admin_Volume = "";
var admin_Mute = "";
var admin_UnMute = "";

var admin_Mode = "";

var admin_AutoForwardText = "";
var admin_NoAutoForwardText = "";

var admin_Replay = "";

var admin_Prev = "";

var admin_Pause = "";
var admin_Play = "";

var admin_Next = "";

var admin_Progress = "";
var admin_ProgressWidth = 775;

var admin_MinTimeWaitAlert = "";
var admin_DropDownAlert = "";
var admin_FlatQuizAlert = "";

var admin_UseScorm = false;
var admin_HostedOniLMS = false;

var FirstLoad = true;
var SuspendData = "";

var admin_QuizPassingPercentage = 50;
var admin_QuizRetakeTillPass = true;
var admin_QuizRetakeMaxCount = 999;
var admin_QuizRetakeCounter = [];

var CourseStartTime = new Date();
var CourseTotalSeconds = 0;

var admin_ShowTimer = false;
var admin_MinTime = 0;
var admin_MinTimeMessage = "";
var admin_TimerText = "Time: ";


//------------------------------------------------------------------------------------------------------------------
var isDown = false;   // Tracks status of mouse button
var isPlay = 0;

var isPageComboOpen = false;
var isGlossaryOpen = false;
var isHelpOpen = false;

var ProgressPrecentage = 0;
var isProgressVisisble = false;
var isVideoProgressVisisble = false;
var ProgressTimer = null;
var ProgressShowTimer = null;

var VideoProgressTimer = null;
var VideoProgressShowTimer = null;

var isVolumeVisible = false;
var VolumeTimer = null;
var VolumeMute = false;
var VolumeSliderMouseDown = false;
var VolumeMouseMin = 15;
var VolumeMouseMax = 140;
var VolumeYOffset = -10;
var VolumeValue = 75;
var VolumerelativePosition = { left: 0, top : VolumeMouseMin};

var CourseXML;
var selectedModuleID = 1;
var selectedPageID = 2;
var PageCount = 1;
var CurrentPageNumber = 1;

var CurrentTemplateID = 1;

var GlossaryXML;

var HelpHTML;

var DialogIsVisible = true;

var CurrentMode = "QF"+getParameterByName("mode");
if (CurrentMode=="QF")
{
	CurrentMode="QF1";
}

var CurrentPosition = 0;


var isModeVisible = false;
var ModeSettingID = "mode-480p";
var PageRowDivID = "C2";
var GlossarySelectID = "Glossary_1";

var XDiff = 0;
var YDiff = 0;

var TemplateArray = [];
var TemplateArrayHasVideo = [];
var TemplateVideoWidth = [];
var TemplateVideoHeight = [];
var TemplateCSS;
var ModulePageArray = [];
var ModulePageArrayType = [];
var ModulePageMinTimeArray = [];
var ModulePageViewableArray = [];

var MaxModulePage = 0;
var GlossaryTerms = [];
var CourseName = "";

var PageTextArray = [];
var PageTextArrayTime = [];
var PageTextArrayTarget = [];
var PageTextArrayInsert = [];
var PageTextArrayFadeSpeed = [];
var PageTextArrayImage = [];
var MaxPageTextCount = 0;
var CurrentTextFrame = 0;

var QuizMode = false;
var SlideMode = false;
var PolicyMode = false;
var FlatQuizMode = false;
var PopupMode = false;
var FinalExamMode = false;
var PreExamExamMode = false;
var SurveyMode = false;

var FlashMode = false;
var FlashModeAudioEndBlink = false;
var FlashModeAudioEndNext = false;

var FirstTimeLoad = true;
var FirstHomeCall = true;

var MouseOnProgressBar = false;
var MouseOnVideo = false;
var VideoLength = 0;

var ScormTotalTime = 0;
var ScormTotalHours = 0;
var ScormTotalMinutes = 0;
var ScormTotalSeconds = 0;
var startingTime = false;
var PlayButtonBlinkTimer = new Object();
var FwdButtonBlinkTimer = new Object();
var fwdtimerblink = new Object();

var InitAudio = "xmls/"+CourseLanguage+"/audio/click.mp3";
var xke = "";
var homecode = "";

var MSIE8_Fix_ClearMedia = false;

var FlashFrameInterval = 100;

var VideoPopopStyle = "quiz";

var admin_L_URL = "";
var KeyCode = "";
var XCode = "1111";
var XCode2 = "1111";
var XCode3 = "1111";

var admin_FinalExamFile="";
var FinalXML = "";
var FinalExamMaxQuestions = 0;
var FinalExamCurrentActiveQuestion = 0;
var FinalExamCurrentGroupMaxQuestions = 0;

var FinalExamQArray = [];
var FinalExamGroupMaxQuestions = [];
var FinalExamGroupMaxQuestionsByOrder = [];
var CurrentQuestionGroup = "";
var VirtualQuestionGroupCounter = 0;

var admin_FinalExamPostQuestionsScorm = true;

var FirstExamPage = true;

var admin_PreExamFile="";
var PreExamXML = "";
var PreExamCurrentActiveQuestion = 0;
var PreExamQArray = [];
var PreExamMaxQuestions =0;

var admin_SurveyFile="";
var SurveyXML = "";
var SurveyCurrentActiveQuestion = 0;
var SurveyQArray = [];
var SurveyMaxQuestions =0;


var SuspendDataArray =[];

// AICC Variables
var admin_UseAicc = false;
var admin_AiccUrl = "";
var admin_AiccSid = "";
// END

var GamificationUserScore = 0;
var GamificationComputerScore = 0;
var GamificationScoreArray = [];
var GamificationQuestionUserScore = 0;
var GamificationQuestionComputerScore = 0;
var GamifcationContinueOnFirstChoice = false;
var GamificationShowInGameScore = false;
var GamificationLastQuestion = false;
var GamificationSuspendData = "";
var GamificationPassingPoints = 0;

var admin_DisableExit = false;

//------------------------------------------------------------------------------------------------------------------
function GamificationStringReplace(xString)
{
	xString = xString.replace("%%GamificationUserScore",GamificationUserScore);
	xString = xString.replace("%%GamificationComputerScore",GamificationComputerScore);


	xStartPos = xString.indexOf("%%GamificationUserWinning");
	xString = xString.replace("%%GamificationUserWinning","");

	xEndPos = xString.indexOf("%%GamificationUserLosing");
	xString = xString.replace("%%GamificationUserLosing","");

	xEndPos2 = xString.indexOf("%%");
	xString = xString.replace("%%","");

	if (xStartPos!=-1)
	{
		if (GamificationUserScore>=GamificationComputerScore)
		{
			xString = xString.replace(xString.substring(xEndPos, xEndPos2), "");
		} else
		{
			xString = xString.replace(xString.substring(xStartPos, xEndPos), "");
		}
	}
	return xString;
}

//------------------------------------------------------------------------------------------------------------------
function CloseGamificationInGameDialog()
{
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").hide();
		$("#FreeFormDialogDiv").hide();
	}
	else
	{
		$("#FadeOutBackgroundDiv").fadeOut(250);
		$("#FreeFormDialogDiv").fadeOut(250);
	}

	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}

	//go to next window
	if (selectedPageID<MaxModulePage)
	{
		ModulePageViewableArray[selectedPageID+1] = 1;
		$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

		if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
		{
			ModulePageViewableArray[selectedPageID+2] = 1;
			$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
		}

		if ((admin_AutoForwardDefaultSetting==true) && (selectedPageID<MaxModulePage))
		{
			selectedPageID++;
			LoadPage(selectedPageID,0,0,1);
		} else
		{
			if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function CloseGamificationFinalDialog(LostGame)
{
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").hide();
		$("#FreeFormDialogDiv").hide();
	}
	else
	{
		$("#FadeOutBackgroundDiv").fadeOut(250);
		$("#FreeFormDialogDiv").fadeOut(250);
	}

	if (CourseMode=="Video") {
		$("#jquery_jplayer_1").jPlayer("stop");
	}
	
	if (LostGame)
	{
		if (!admin_QuizRetakeTillPass)
		{
			//call exit function
			if (admin_UseAicc) { CloseCourse_AICC(true); } else { CloseCourse(true); }
		} else
		{
			GamificationUserScore = 0;
			GamificationComputerScore = 0;
			GamificationScoreArray = [];
			GamificationQuestionUserScore = 0;
			GamificationQuestionComputerScore = 0;
			GamificationShowInGameScore = false;
			GamificationLastQuestion = false;
			
			PreExamAnswerCache = [];
			PreExamAnswerTextCache = [];
			PreExamAnswerRightCache = [];

			PreExamScormQuestionCache = [];
			PreExamScormAnswersCache = [];
			PreExamScormUserAnswerCache = [];
			PreExamScormCorrectAnswerCache = [];
			
			selectedPageID=1;
			LoadPage(selectedPageID,0,0,1);
		}
	} else
	{
		if (admin_UseAicc) { SetLessonPassed_AICC(100,true);  } else { SetLessonPassed(100,true);  }
		
		//go to next window
		if (selectedPageID<MaxModulePage)
		{
			ModulePageViewableArray[selectedPageID+1] = 1;
			$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

			if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
			{
				ModulePageViewableArray[selectedPageID+2] = 1;
				$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
			}

			if ((admin_AutoForwardDefaultSetting==true) && (selectedPageID<MaxModulePage))
			{
				selectedPageID++;
				LoadPage(selectedPageID,0,0,1);
			} else
			{
				if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
			}
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function GamificationDialog(LastQuestion)
{
	var GamificationIsLost = false;
	if (LastQuestion)
	{
		if ( ((GamificationUserScore<GamificationComputerScore) && (GamificationPassingPoints==0)) || (GamificationUserScore<GamificationPassingPoints) )
		{
			GamificationIsLost=true;
			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({"top": $(CourseXML).find("GamificationLost").attr("Top") + "px" , "left": $(CourseXML).find("GamificationLost").attr("Left")  +"px" });
			$("#FreeFormDialogDiv").html( GamificationStringReplace ( $(CourseXML).find("GamificationLost").text() ) );
			$("#FreeFormDialogCloseButton").attr('tabindex', "10");

			GamficationBoxAudio = $(CourseXML).find("GamificationLost").attr("AudioFile");

			if (GamficationBoxAudio!="")
			{
				if (CourseMode=="Video") {
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: GamficationBoxAudio });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		} else
		{
			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({"top": $(CourseXML).find("GamificationWon").attr("Top") + "px" , "left": $(CourseXML).find("GamificationWon").attr("Left")  +"px" });
			$("#FreeFormDialogDiv").html( GamificationStringReplace ( $(CourseXML).find("GamificationWon").text() ) );
			$("#FreeFormDialogCloseButton").attr('tabindex', "10");

			GamficationBoxAudio = $(CourseXML).find("GamificationWon").attr("AudioFile");

			if (GamficationBoxAudio!="")
			{
				if (CourseMode=="Video") {
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: GamficationBoxAudio });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		}

		$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

		if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
		{
			$("#FadeOutBackgroundDiv").show();
			$("#FreeFormDialogDiv").show();
		}
		else
		{
			$("#FadeOutBackgroundDiv").fadeIn(250);
			$("#FreeFormDialogDiv").fadeIn(250);
		}

		$.doTimeout( '', 500, function(){
			$("#FreeFormDialogCloseButton").on('click', function()
			{
				CloseGamificationFinalDialog(GamificationIsLost);
				return false;
			});
		});
	} else
	{
		if (GamificationUserScore<GamificationComputerScore)
		{
			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({"top": $(CourseXML).find("GamificationLoosing").attr("Top") + "px" , "left": $(CourseXML).find("GamificationLoosing").attr("Left")  +"px" });
			$("#FreeFormDialogDiv").html( GamificationStringReplace ( $(CourseXML).find("GamificationLoosing").text() ) );
			$("#FreeFormDialogCloseButton").attr('tabindex', "10");

			GamficationBoxAudio = $(CourseXML).find("GamificationLoosing").attr("AudioFile");

			if (GamficationBoxAudio!="")
			{
				if (CourseMode=="Video") {
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: GamficationBoxAudio });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		} else
		{
			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({"top": $(CourseXML).find("GamificationWinning").attr("Top") + "px" , "left": $(CourseXML).find("GamificationWinning").attr("Left")  +"px" });
			$("#FreeFormDialogDiv").html( GamificationStringReplace ( $(CourseXML).find("GamificationWinning").text() ) );
			$("#FreeFormDialogCloseButton").attr('tabindex', "10");

			GamficationBoxAudio = $(CourseXML).find("GamificationWinning").attr("AudioFile");

			if (GamficationBoxAudio!="")
			{
				if (CourseMode=="Video") {
					$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: GamficationBoxAudio });
					$("#jquery_jplayer_1").jPlayer("play");
					isPlay = 1;
					$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
					$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
				}
			}
		}

		$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

		if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
		{
			$("#FadeOutBackgroundDiv").show();
			$("#FreeFormDialogDiv").show();
		}
		else
		{
			$("#FadeOutBackgroundDiv").fadeIn(250);
			$("#FreeFormDialogDiv").fadeIn(250);
		}

		$.doTimeout( '', 500, function(){
			$("#FreeFormDialogCloseButton").on('click', function()
			{
				CloseGamificationInGameDialog();
				return false;
			});
		});
	}
}


//------------------------------------------------------------------------------------------------------------------
function NewDialog(Top,Left,Width,Height,BgAudioFile,NewDialogTitle,NewDialogContent,ExternalContent)
{

	var ContentMargin = 20;
	if (ExternalContent) { ContentMargin = 0; }
	if (SurveyMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
	} else
	if (PreExamMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
	} else
	if (FinalExamMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
	} else
	if (FlashMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFlashFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFlashDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFlashDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFlashDialogContent");
	} else
	if (PolicyMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CoursePolicyFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CoursePolicyDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CoursePolicyDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CoursePolicyDialogContent");
	} else
 	if (FlatQuizMode) //also is for interactive quiz
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseFlatFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseFlatDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseFlatDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseFlatDialogContent");
	} else
	if (QuizMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseQuizFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseQuizDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseQuizDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseQuizDialogContent");
	} else
	if (SlideMode)
	{
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseSlideFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseSlideDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseSlideDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseSlideDialogContent");
	} else
	if ( (!QuizMode) && (!SlideMode) && (!PolicyMode) && (!FlatQuizMode) && (!FinalExamMode) && (!PreExamMode) && (!SurveyMode) && (!FlashMode)) //video mode
	{
		if (VideoPopopStyle=="quiz")
		{
			$("#FadeOutBackgroundDiv").removeClass().addClass("CourseVideoQuizFadeOutBackground");
			$("#CourseDialogContainerDiv").removeClass().addClass("CourseVideoQuizDialogContainer");
			$("#CourseDialogHeaderDiv").removeClass().addClass("CourseVideoQuizDialogHeader");
			$("#CourseDialogContentDiv").removeClass().addClass("CourseVideoQuizDialogContent");
		} else
		if (VideoPopopStyle=="content")
		{
			$("#FadeOutBackgroundDiv").removeClass().addClass("CourseVideoContentFadeOutBackground");
			$("#CourseDialogContainerDiv").removeClass().addClass("CourseVideoContentDialogContainer");
			$("#CourseDialogHeaderDiv").removeClass().addClass("CourseVideoContentDialogHeader");
			$("#CourseDialogContentDiv").removeClass().addClass("CourseVideoContentDialogContent");
		}
	} else
	{ //default classes
		if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
			if (DialogIsVisible) { 
				window.location.href=admin_L_URL;  
				return false; 
			} 
		}
		$("#FadeOutBackgroundDiv").removeClass().addClass("CourseDefaultFadeOutBackground");
		$("#CourseDialogContainerDiv").removeClass().addClass("CourseDefaultDialogContainer");
		$("#CourseDialogHeaderDiv").removeClass().addClass("CourseDefaultDialogHeader");
		$("#CourseDialogContentDiv").removeClass().addClass("CourseDefaultDialogContent");
	}

	$("#CourseDialogContentDiv").css({"padding":""});
	if (ExternalContent) { $("#CourseDialogContentDiv").css({"padding":"0px"}); }



	if (NewDialogTitle=="") {$("#CourseDialogHeaderDiv").hide(); ContentMargin = 0; } else {$("#CourseDialogHeaderDiv").show();}

	if ( typeof BgAudioFile !== 'undefined' )
	{
		if ((CourseMode=="Video") && (BgAudioFile!="") && (!isiPad))
		{
			$.doTimeout( '', 350, function(){
				$("#Background_Audio_Player").jPlayer("setMedia", { mp3: BgAudioFile }).jPlayer("play");
			});
		}
	}


	$("#CourseDialogContainerDiv").css({"top": Top + "px" , "left": Left +"px" ,"width":Width+"px","height":Height+"px"});
	$("#CourseDialogContentDiv").css({"width": ($("#CourseDialogContainerDiv").width()-ContentMargin) });

	$("#FadeOutBackgroundDiv").css({"top" :"5px" , "left" : "5px" , "width": ($("#skin-container").width()-10) + "px" , "height": ($("#skin-container").height()-15) +"px", "border-radius":"5px"});

	$("#CourseDialogContentDiv").html("");
	$("#CourseDialogHeaderDiv").html(NewDialogTitle);
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").show();
		$("#CourseDialogContainerDiv").show();
	}
	else
	{
		$("#FadeOutBackgroundDiv").fadeIn(DialogFadeSpeed);
		$("#CourseDialogContainerDiv").fadeIn(DialogFadeSpeed);
	}

	$.doTimeout( '', 50, function(){
		$("#CourseDialogContentDiv").css({"height": ( $("#CourseDialogContainerDiv").innerHeight() - $("#CourseDialogHeaderDiv").outerHeight() - ContentMargin) });
		$("#CourseDialogContentDiv").html(NewDialogContent);
	});
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
}

//------------------------------------------------------------------------------------------------------------------
function NewDialogClose()
{
	$("#Background_Audio_Player").jPlayer("stop");
	$("#Background_Audio_Player").jPlayer( "clearMedia" );
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
	if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
	{
		$("#FadeOutBackgroundDiv").hide();
		$("#CourseDialogContainerDiv").hide();
	} else
	{
		$("#FadeOutBackgroundDiv").fadeOut(DialogFadeSpeed);
		$("#CourseDialogContainerDiv").fadeOut(DialogFadeSpeed);
	}
}

//------------------------------------------------------------------------------------------------------------------
function parseVersionXml(xml)
{
	admin_Version = $(xml).find("Version").text();
	xke = $(xml).find("VersionText").text();

	homecode = $(xml).find("HomeCode").text();
	if (typeof homecode =="undefined") { homecode=""; };
	KeyCode = $(xml).find("KeyCode").text();

	LoadSettingsXML();
}

//------------------------------------------------------------------------------------------------------------------
function parseSettingsXml(xml)
{
	loadCourseCssFile($(xml).find("CourseCSSFile").text());
	loadCourseCssFile("skins/"+$(xml).find( "SkinCSSFile").text()+"/"+$(xml).find( "SkinCSSFile").text()+".css?q=470" );

	if ((parseInt($.browser.version, 10) === 11) || ($.browser.msie  && parseInt($.browser.version, 10) === 8))
	{
		//ignore skinning if it is MSIEE 11
	} else
	{
		loadCourseCssFile("skins/"+$(xml).find( "SkinCSSFile").text()+"/_styles.css?q=470" );

		if (($.browser.msie  && parseInt($.browser.version, 10) === 8))// || (parseInt($.browser.version, 10) === 11))
		{
			loadCourseCssFile("skins/"+$(xml).find( "SkinCSSFile").text()+"/_styles-ie8.css?q=470" );
		} else
		{
			loadCourseCssFile("skins/"+$(xml).find( "SkinCSSFile").text()+"/_styles.css?q=470" );
		}
	}

	update_buttons_SkinPath("skins/"+$(xml).find( "SkinCSSFile").text()+"/");

	$("input.graphically + label.graphically").css('background', 'url("../skins/'+$(xml).find( "SkinCSSFile").text()+'/gr_custom-inputs.png") 0 -1px no-repeat;');

	$("#ajax-loading-graph").attr("src","skins/"+$(xml).find( "SkinCSSFile").text()+"/ajax-loader.gif");

	//read the progressbar width with delay to make sure css has loaded
	$.doTimeout( '', 500, function(){
		var $tempwidth_p = $("<p id=\"tempwidth\" class=\"skin_progressbar_width\"></p>").hide().appendTo("body");
//		alert(parseInt( $tempwidth_p.css("width"), 10));
		if (parseInt( $tempwidth_p.css("width"), 10)>100)
		{
			admin_ProgressWidth = parseInt( $tempwidth_p.css("width"), 10);
			$("#video-progress-bar").width(Math.round((admin_ProgressWidth+5))+"px" );
		}
		$tempwidth_p.remove();
	});

	$("#version-text").html( admin_Version );
	$("#copyright-text").html( admin_CopyrightInfo );

	admin_L_URL = $(xml).find("LicenseURL").text();

	//Read AICC Variables
	admin_UseAicc = $(xml).find("UseAICC").text().toLowerCase() === 'true';
	if(admin_UseAicc){
		admin_AiccUrl = getParameterByName('AICC_URL');
		admin_AiccSid = getParameterByName('AICC_SID');
		if(admin_AiccUrl == "" && admin_AiccSid == ""){
			alert("AICC HACP communication parameters are missing. Please contact administrator.");
		}
	}
	//End

	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}

	admin_URLOnExit = $(xml).find("URLOnExit").text();

	admin_CopyrightInfo = $(xml).find("CopyrightInfo").text();

	admin_AutoForwardDefaultSetting = $(xml).find("AutoForwardDefaultSetting").text().toLowerCase() === 'true';

	admin_AutoForwardEnabled = $(xml).find("AutoForwardEnabled").text().toLowerCase() === 'true';
	admin_ForwardBlink = $(xml).find("ForwardBlink").text().toLowerCase() === 'true';
	
	admin_AutoForwardText = $(xml).find("AutoForwardText").text();
	admin_NoAutoForwardText = $(xml).find("NoAutoForwardText").text();

	//check if auto forward should be disabled
	$("#autoforward-button").attr('alt',admin_AutoForwardText);	$("#autoforward-button").attr('title',admin_AutoForwardText);
	if (admin_AutoForwardEnabled==false)
	{
		$("#autoforward-button").removeClass("autoforward-button-style").addClass("autoforward-button-disabled-style");
	} else
	{
		if (admin_AutoForwardDefaultSetting==false)
		{
			$("#autoforward-button").removeClass("autoforward-button-style").addClass("noautoforward-button-style");
			$("#autoforward-button").attr('alt',admin_NoAutoForwardText);
			$("#autoforward-button").attr('title',admin_NoAutoForwardText);
		}

		$("#autoforward-button").bind('click',function() { AutoForwardClick(); });
	}


	admin_UseScorm = $(xml).find("UseScorm").text().toLowerCase() === 'true';
	admin_HostedOniLMS = $(xml).find("HostedOniLMS").text().toLowerCase() === 'true';

	admin_DisableVolume = $(xml).find("DisableVolume").text().toLowerCase() === 'true';

	if (admin_DisableVolume)
	{
		$("#volume-button").removeClass("volume-button-style").addClass("volume-button-disabled-style");
	}


	admin_BottomLogo = $(xml).find("BottomLogo").text();
	admin_TopLogo = $(xml).find("TopLogo").text();

	admin_HelpFile = $(xml).find("HelpFile").text();
	admin_GlossaryFile = $(xml).find("GlossaryFile").text();
	admin_CourseFile = $(xml).find("CourseFile").text();

	admin_RetakeFinalExam = $(xml).find("RetakeFinalExam").text();

	admin_Submit = $(xml).find("Submit").text();
	admin_Finish = $(xml).find("Finish").text();
	admin_Help = $(xml).find("Help").text();
	admin_Glossary = $(xml).find("Glossary").text();
	admin_SaveAndExit = $(xml).find("SaveAndExit").text();
	admin_Review = $(xml).find("Review").text();

	//if review has not already been set by scorm get it from adminsettings.xml
	if (!admin_ReviewMode) {admin_ReviewMode = $(xml).find("ReviewMode").text().toLowerCase()==='true';}

	admin_VideoProgress = $(xml).find("VideoProgress").text().toLowerCase()==='true';
	admin_VideoProgressCanMove = $(xml).find("VideoProgressCanMove").text().toLowerCase()==='true';

	admin_Volume = $(xml).find("Volume").text();
	admin_Mute = $(xml).find("Mute").text();
	admin_UnMute = $(xml).find("UnMute").text();

	admin_Mode = $(xml).find("Mode").text();

	admin_Replay = $(xml).find("Replay").text();

	admin_Prev = $(xml).find("Prev").text();

	admin_Pause = $(xml).find("Pause").text();
	admin_Play = $(xml).find("Play").text();

	admin_Next = $(xml).find("Next").text();

	admin_Progress = $(xml).find("Progress").text();

	admin_MinTimeWaitAlert = $(xml).find("MinTimeWaitAlert").text();
	admin_DropDownAlert = $(xml).find("DropDownAlert").text();
	admin_FlatQuizAlert = $(xml).find("FlatQuizAlert").text();

	admin_ShowTimer = $(xml).find("ShowTimer").text().toLowerCase()==='true';
	admin_MinTime = $(xml).find("MinTime").text();
	admin_MinTime = parseInt(admin_MinTime,10);
	admin_MinTimeMessage = $(xml).find("MinTimeMessage").text();
	admin_TimerText = $(xml).find("TimerText").text();

	admin_FinalExamPostQuestionsScorm = $(xml).find("FinalExamPostQuestionsScorm").text().toLowerCase() === 'true';

	admin_DisableExit = $(xml).find("DisableExit").text().toLowerCase()==='true';
	
	LoadCourseXML();
	LoadGlossary();

	$("#custom-logo").css( { backgroundImage : 'url('+admin_TopLogo+')', backgroundRepeat: 'no-repeat' } );
	$("#product-logo").css( { backgroundImage : 'url('+admin_BottomLogo+')', backgroundRepeat: 'no-repeat' } );

	$("#glossary-select-title-text").html( admin_Glossary );
	$("#help-window-title-text").html( admin_Help );
	$("#mode-box-text").html( admin_Mode );

	$("#help-button").attr('alt',admin_Help );	$("#help-button").attr('title',admin_Help );
	$("#glossary-button").attr('alt',admin_Glossary );	$("#glossary-button").attr('title',admin_Glossary );
	$("#exit-button").attr('alt',admin_SaveAndExit );	$("#exit-button").attr('title',admin_SaveAndExit );
	
	if (admin_DisableExit) { 
		xwidth = $("#exit-button").width();
		$("#exit-button").hide(); 
		
		$("#help-button").css({'left': (parseInt($("#help-button").css("left"),10)+xwidth)+"px" });
		$("#glossary-button").css({'left': (parseInt($("#glossary-button").css("left"),10)+xwidth)+"px" });
	}

	$("#volume-button").attr('alt',admin_Volume);	$("#volume-button").attr('title',admin_Volume);
	$("#volume-popup-mute").attr('alt',admin_Mute);	$("#volume-popup-mute").attr('title',admin_Mute);

	$("#mode-button").attr('alt',admin_Mode);	$("#mode-button").attr('title',admin_Mode);
	$("#replay-button").attr('alt',admin_Replay);	$("#replay-button").attr('title',admin_Replay);

	$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
	$("#forward-button").attr('alt',admin_Next);	$("#forward-button").attr('title',admin_Next);
	$("#backward-button").attr('alt',admin_Prev);	$("#backward-button").attr('title',admin_Prev);

	$("#help-window-description").load(admin_HelpFile);

	//disable volume if ipad
	if (isiPad) { admin_DisableVolume = true; }
	if (isAndroid) { admin_DisableVolume = true; }

	$("#ajax-loading-graph").css({"left":"390px"});
	$("#ajax-loading-graph").css({"top":"195px"});
	$("#ajax-loading-graph").hide();
}


//------------------------------------------------------------------------------------------------------------------
function SaveSettingsXML(xml)
{
	SettingsXML = xml;
	parseSettingsXml(SettingsXML);
}

//------------------------------------------------------------------------------------------------------------------
function LoadSettingsXML()
{
	$.ajax({
		type: "GET",
		url: "xmls/"+CourseLanguage+"/adminsettings.xml?q=430&time="+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveSettingsXML
	});
}

//------------------------------------------------------------------------------------------------------------------
function SaveVersionXML(xml)
{
	VersionXML = xml;
	parseVersionXml(VersionXML);
}

//------------------------------------------------------------------------------------------------------------------
function LoadVersionXML()
{
	$.ajax({
		type: "GET",
		url: "js/data.xml?q=430&time="+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveVersionXML
	});
}


//------------------------------------------------------------------------------------------------------------------
function resizeControls()
{
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	UpdateProgressBar();

	var NewTop = ((windowHeight/2) - ($("#skin-container").height() / 2));
	if (NewTop<5) { NewTop = 5;}
	$("#page").css( { "margin-top":NewTop +"px" } );

	var NewLeft = ((windowWidth/2) - ($("#skin-container").width() / 2));
	if (NewLeft<5) { NewLeft = 5;}
	$("#page").css( { "margin-left":NewLeft +"px" } );
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
	$("#page").show();
}

//------------------------------------------------------------------------------------------------------------------
function UpdateProgressBar()
{

	ProgressPrecentage = Math.round( (CurrentPageNumber / PageCount ) * 100 );
	if ( typeof ModulePageArray[selectedPageID] !== 'undefined' )
	{
		PageToolTip = admin_Progress;
		PageToolTip = PageToolTip.replace("%%PageNo",CurrentPageNumber);
		PageToolTip = PageToolTip.replace("%%TotalPages",PageCount);
		PageToolTip = PageToolTip.replace("%%PageName",ModulePageArray[selectedPageID].slice(1));

		$("#tooltip-text").html( "<nobr>" + PageToolTip + "</nobr>" ); //Page " + CurrentPageNumber + " out of " + PageCount + " - " +ModulePageArray[selectedPageID].slice(1) + "
	} else
	{
		$("#tooltip-text").html("IEngine");
	}


	$("#progress-bar-circle").css( { "left":Math.round((admin_ProgressWidth * ProgressPrecentage / 100)-9 )+"px" } );
	$("#progress-bar-middle").width(Math.round(admin_ProgressWidth * ProgressPrecentage / 100)+"px");

	var tooltip_left = $("#progress-bar").position().left + Math.round((admin_ProgressWidth * ProgressPrecentage / 100)-5 );
	var tooltip_width = $("#tooltip").width();
	var tooltip_half_width = Math.round($("#tooltip").width() / 2);
	var bubble_width = Math.round($("#tooltip-bubble").width() / 2);

	var bubble_position = tooltip_half_width-bubble_width;

	var tooltip_left_pos = tooltip_left-tooltip_half_width+bubble_width-4;

	if (tooltip_left_pos<10) {
		$("#tooltip-bubble").show();
		bubble_position = bubble_position + tooltip_left_pos - 10;
		if (ProgressPrecentage<4) { $("#tooltip-bubble").hide(); } else { $("#tooltip-bubble").show(); }
		tooltip_left_pos = 10;
	} else

	if ( (tooltip_left_pos+tooltip_width) > (admin_ProgressWidth) ) {
		bubble_position = bubble_position + (tooltip_left_pos+tooltip_width-(admin_ProgressWidth+17));

		tooltip_left_pos = (admin_ProgressWidth+17)-tooltip_width;

		if (ProgressPrecentage>90) { $("#tooltip-bubble").hide(); } else { $("#tooltip-bubble").show(); }
	} else
	{
		$("#tooltip-bubble").show();
	}



	$("#tooltip").css( { "left":( tooltip_left_pos )+"px" } );
	$("#tooltip-bubble").css( { "left": bubble_position+"px" } );
	$("#tooltip").css( { "top": ($("#progress-bar").position().top-60)+"px" } );
}



//------------------------------------------------------------------------------------------------------------------
function HideProgress()
{
	isProgressVisisble = false;
	$("#tooltip").fadeOut('slow');
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
	$("#progress-bar-circle").fadeOut('slow');
}

//------------------------------------------------------------------------------------------------------------------
function ShowVideoProgress()
{
	if ((isVideoProgressVisisble==false) && (admin_VideoProgress))
	{
		isVideoProgressVisisble = true;
		$("#video-progress-bar").css('visibility','visible').fadeIn('fast');
	}
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
	clearTimeout(VideoProgressTimer);
}

//------------------------------------------------------------------------------------------------------------------
function HideVideoProgress()
{
	if (admin_VideoProgress)
	{
		isVideoProgressVisisble = false;
		$("#video-progress-bar").fadeOut('slow');
	}
}

//------------------------------------------------------------------------------------------------------------------
function ShowProgress()
{
	if (isProgressVisisble==false)
	{
		isProgressVisisble = true;
		$("#progress-bar-circle").css('visibility','visible').fadeIn('fast');
		$("#tooltip").css('visibility','visible').fadeIn('fast');
	}
	clearTimeout(ProgressTimer);
}

//------------------------------------------------------------------------------------------------------------------
function ShowVolume()
{
	if (!admin_DisableVolume)
	{
		if ((isVolumeVisible==false)) // && (VolumeMute==0))
		{
			isVolumeVisible = true;
			$("#volume-box").css('visibility','visible').show('slide', { direction: 'down' }, 350); //.fadeIn('fast');
			$("#volume-button").addClass("volume-button-style-hover");
		}
		if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
			if (DialogIsVisible) { 
				window.location.href=admin_L_URL;  
				return false; 
			} 
		}
		clearTimeout(VolumeTimer);
	}
}

//------------------------------------------------------------------------------------------------------------------
function HideVolume()
{
	if (!admin_DisableVolume)
	{
		if (isVolumeVisible==true)
		{
			isVolumeVisible = false;
			$("#volume-box").hide('slide', { direction: 'down' }, 150); //.fadeOut('slow');
			$("#volume-button").removeClass("volume-button-style-hover");
			VolumeSliderMouseDown=false;
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function toggleModeBox()
{
	if (QuizMode) { return false; }
	if ( $("#mode-button").hasClass("mode-button-style-offline") ) { return false; }

	if (isModeVisible==false)
	{
		isModeVisible=true;

		$("#mode-box").css('visibility','visible').show('slide', { direction: 'down' }, 250);
		$("#mode-button").addClass("mode-button-style-active");
	} else
	{
		isModeVisible=false;

		$("#mode-box").hide('slide', { direction: 'down' }, 150);
		$("#mode-button").removeClass("mode-button-style-active");
	}
}

//------------------------------------------------------------------------------------------------------------------
function toggleVolumeMute()
{
	if (!admin_DisableVolume)
	{
		if (VolumeMute==false)
		{
			$("#volume-popup-mute").attr('alt',admin_UnMute);	$("#volume-popup-mute").attr('title',admin_UnMute);

			$("#volume-button").removeClass("volume-button-style").addClass("volume-button-mute-style");
			$("#volume-popup-mute").removeClass("volume-popup-speaker-style").addClass("volume-popup-mute-style");
			VolumeMute=true;
			if ( TemplateArrayHasVideo[ CurrentTemplateID ] ) {	$("#jplayer_video").jPlayer("mute", true ); }
			$("#jquery_jplayer_1").jPlayer("mute", true );
			$("#jquery_jplayer_1").jPlayer("volume", 0 );
			$("#Background_Audio_Player").jPlayer("mute", true );
			$("#Background_Audio_Player").jPlayer("volume", 0 );
		} else
		{
			$("#volume-popup-mute").attr('alt',admin_Mute);	$("#volume-popup-mute").attr('title',admin_Mute);

			$("#volume-button").removeClass("volume-button-mute-style").addClass("volume-button-style");

			$("#volume-popup-mute").removeClass("volume-popup-mute-style").addClass("volume-popup-speaker-style");
			VolumeMute=false;
			if ( TemplateArrayHasVideo[ CurrentTemplateID ] ) { $("#jplayer_video").jPlayer("mute", false ); }
			$("#jquery_jplayer_1").jPlayer("mute", false );
			$("#jquery_jplayer_1").jPlayer("volume", VolumeValue/100 );
			$("#Background_Audio_Player").jPlayer("mute", false );
			$("#Background_Audio_Player").jPlayer("volume", VolumeValue/100 );
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function ChangeVolume(y)
{
	if (!admin_DisableVolume)
	{

		if (VolumeMute==true) { toggleVolumeMute();	}
		if (y<VolumeMouseMin) { y = VolumeMouseMin; }
		if (y>VolumeMouseMax) { y = VolumeMouseMax; }

		VolumeValue = Math.round( ((VolumeMouseMax-y) / (VolumeMouseMax-VolumeMouseMin)) * 100 );
		$("#volume-slider-button").css( { "top":( y+VolumeYOffset)+"px" } );
	}
}

//------------------------------------------------------------------------------------------------------------------
function ChangeMode(e)
{
	if (QuizMode) { return false; }

	$("#"+ModeSettingID).removeClass("mode-settings-style-active");
	ModeSettingID=e;
	
	
	if (ModeSettingID.charAt(1)=="T") { VolumeMute=false; } else { VolumeMute=true; }
	toggleVolumeMute();
	
//	console.log(ModeSettingID+" "+ModeSettingID.charAt(1));

	CurrentMode = ModeSettingID.slice(2); //delete first two characters

//	console.log(CurrentMode);

	$("#"+ModeSettingID).addClass("mode-settings-style-active");
	if (isModeVisible==true) {toggleModeBox();}

	CurrentPositionX = CurrentPosition;

	FlashAbortTimer();
	FlashTime=-1;
	

	LoadPage(selectedPageID,CurrentPositionX,0,true);
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
}

//------------------------------------------------------------------------------------------------------------------
function UpdateMouseVolume(e)
{
	if (!admin_DisableVolume)
	{

		VolumerelativePosition = {
		  left: e.pageX - $(document).scrollLeft() - $('#volume-slider').offset().left,
		  top : e.pageY - $(document).scrollTop() - $('#volume-slider').offset().top
		};

		if (VolumeSliderMouseDown==true) {
			ChangeVolume(VolumerelativePosition.top);
			if ( TemplateArrayHasVideo[ CurrentTemplateID ] ) { $("#jplayer_video").jPlayer("volume", VolumeValue/100 ); }
			$("#jquery_jplayer_1").jPlayer("volume", VolumeValue/100 );
			$("#Background_Audio_Player").jPlayer("volume", VolumeValue/100 );
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function CloseQuizDialogs()
{
	NewDialogClose();

	if (QuizMode) {
		$("#jquery_jplayer_1").jPlayer("stop");
	}
}

//------------------------------------------------------------------------------------------------------------------
function ForwardClick()
{
	$("#FadeOutBackgroundDiv").hide();
	$("#FreeFormDialogDiv").hide();

	window.clearInterval(FwdButtonBlinkTimer);
	window.clearTimeout(fwdtimerblink);

	if ( $("#forward-button").hasClass("forward-button-style-offline") ) {

		if ((FlatQuizMode) || (QuizMode) || (FinalExamMode) || (PreExamMode) || (SurveyMode))
		{
			alert(admin_FlatQuizAlert);
		}
		return false;
	}

	if (FinalExamMode) {
//		console.log(VirtualQuestionGroupCounter+"<"+FinalExamGroupMaxQuestions[ CurrentQuestionGroup ]);
		if (VirtualQuestionGroupCounter<FinalExamGroupMaxQuestions[ CurrentQuestionGroup ])
		{
			if (!admin_ReviewMode)
			{
				$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
				$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
			}

			VirtualQuestionGroupCounter++;
			FinalExamCurrentActiveQuestion++;
			DrawFinalExamQuiz(FinalExamCurrentActiveQuestion);
			return false;
		} else
		{
			//unlock next page if exam is over
			if (selectedPageID<MaxModulePage)
			{
				ModulePageViewableArray[selectedPageID+1] = 1;
				$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

				if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
				{
					ModulePageViewableArray[selectedPageID+2] = 1;
					$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
				}
			}
		}
	}

	if (PreExamMode) {
		if (PreExamCurrentActiveQuestion<PreExamMaxQuestions)
		{
			if (!admin_ReviewMode)
			{
				$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
				$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
			}

			PreExamCurrentActiveQuestion++;
			DrawPreExamQuiz(PreExamCurrentActiveQuestion);
			return false;
		} else
		{
			//unlock next page if exam is over
			if (selectedPageID<MaxModulePage)
			{
				ModulePageViewableArray[selectedPageID+1] = 1;
				$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

				if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
				{
					ModulePageViewableArray[selectedPageID+2] = 1;
					$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
				}
			}
		}
	}

	if (SurveyMode) {
		if (SurveyCurrentActiveQuestion<SurveyMaxQuestions)
		{
			if (!admin_ReviewMode)
			{
				$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
				$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
			}

			SurveyCurrentActiveQuestion++;
			DrawSurveyQuiz(SurveyCurrentActiveQuestion);
			return false;
		} else
		{
			//unlock next page if exam is over
			if (selectedPageID<MaxModulePage)
			{
				ModulePageViewableArray[selectedPageID+1] = 1;
				$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

				if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
				{
					ModulePageViewableArray[selectedPageID+2] = 1;
					$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
				}
			}
		}
	}

	if ( (QuizMode) && (!admin_ReviewMode)) { return false; }
	CloseQuizDialogs();

	selectedPageID++;

	if ((ModulePageViewableArray[selectedPageID]==0) && (!QuizMode) && (!SlideMode) && (!PolicyMode))
	{
		selectedPageID = selectedPageID-1;
		if (FlatQuizMode)
		{
			alert(admin_FlatQuizAlert);
		}
		else
		{
			alert(admin_MinTimeWaitAlert.replace("%%MinTime",ModulePageMinTimeArray[selectedPageID]));
		}
	} else
	{
		FlashAbortTimer();
		FlashTime=-1;

		LoadPage(selectedPageID,0,0,true);
	}
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
}



//------------------------------------------------------------------------------------------------------------------
function BackwardsClick()
{
	$("#FadeOutBackgroundDiv").hide();
	$("#FreeFormDialogDiv").hide();

	if ( $("#backward-button").hasClass("backward-button-style-offline") ) { return false; }

	if ( (QuizMode) && (!admin_ReviewMode)) { return false; }
	if ( (FinalExamMode) && (!admin_ReviewMode)) { return false; }
	if ( (PreExamMode) && (!admin_ReviewMode)) { return false; }
	if ( (SurveyMode) && (!admin_ReviewMode)) { return false; }

	CloseQuizDialogs();

	selectedPageID--;
	if (ModulePageArray[selectedPageID].charAt(0)=="M") {selectedPageID--;}

	FlashAbortTimer();
	FlashTime=-1;

	LoadPage(selectedPageID,0,0,true);
}

//------------------------------------------------------------------------------------------------------------------
function ReplayClick()
{
	if (QuizMode) { return false; }
	if ( $("#replay-button").hasClass("replay-button-disabled-style") ) { return false; }

	CloseQuizDialogs();

	FlashAbortTimer();
	FlashTime=-1;

	LoadPage(selectedPageID,0,0,true);
}

//------------------------------------------------------------------------------------------------------------------
function ChapterComboClick()
{
	if ((QuizMode) && (!admin_ReviewMode)) { return false; }

	if (isPageComboOpen==false) {
		isPageComboOpen = true;
		$("#page-combo").removeClass("page-combo-style").addClass("page-combo-style-active");
		$("#page-select").css('visibility','visible').show('slide', { direction: 'up' }, 350, function() { 
			$.doTimeout( '', 50, function(){ 
				$("#page-select-text").css('margin-bottom','0px'); 
				
				$("#page-select-text").scrollTop($("#page-select-text").scrollTop() + $(".page-select-text-line-style-active").position().top - ( $("#page-select-text").height()/2 + $(".page-select-text-line-style-active").height()/2) );
			}); 
		});

	} else
	{
		isPageComboOpen = false;
		$("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
		$("#page-select").hide('slide', { direction: 'up' }, 350);
		$("#page-select-text").css('margin-bottom','1px');

	}
}

//------------------------------------------------------------------------------------------------------------------
function GlossaryClick()
{
	if ((QuizMode) && (!admin_ReviewMode)) { return false; }
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
	if (isGlossaryOpen==false) {
		isGlossaryOpen = true;
		$("#glossary-button").removeClass("glossary-button-style").addClass("glossary-button-style-active");
		$("#glossary-select").css('visibility','visible').show('drop', { direction: 'up' }, 350, function() { $.doTimeout( '', 50, function(){ $("#glossary-select-middle").css('margin','0px'); } ); });
	} else
	{
		isGlossaryOpen = false;
		$("#glossary-button").addClass("glossary-button-style").removeClass("glossary-button-style-active");
		$("#glossary-select").hide('drop', { direction: 'up' }, 350);
		$("#glossary-select-middle").css('margin','1px');
	}
}

//------------------------------------------------------------------------------------------------------------------
function HelpClick()
{
	if ((QuizMode) && (!admin_ReviewMode)) { return false; }

	if (isHelpOpen==false) {
		isHelpOpen = true;
		$("#help-button").removeClass("help-button-style").addClass("help-button-style-active");
		$("#help-window").css('visibility','visible').show('drop', { direction: 'up' }, 350, function() { $.doTimeout( '', 50, function(){ $("#wrap").css('margin','0px'); } ); });
	} else
	{
		isHelpOpen = false;
		$("#help-button").addClass("help-button-style").removeClass("help-button-style-active");
		$("#help-window").hide('drop', { direction: 'up' }, 350);
		$("#wrap").css('margin','1px');
	}
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
}

//------------------------------------------------------------------------------------------------------------------
function attachClickAction()
{
	$(".textlink").on('click', function()
	{
		VideoPopopStyle = "content";
		ShowStandardDialog($(this).data('dialog'));
		return false;
	});

	$(".maillink").on('click', function()
	{
		if ((CourseMode=="Video") && (!FlashMode)) {
			$("#jplayer_video").jPlayer("pause" );
			isPlay = 0;
			$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
			$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
		}

		var link = 'mailto.html#mailto:' + $(this).data('mailto');
		window.open(link, 'Mailer');
		return false;
	});

}

//------------------------------------------------------------------------------------------------------------------
function UpdateTextArea(ForceUpdate)
{
	if ((isPlay==1) || (ForceUpdate==1))
	{
		for (xCounter=1; xCounter<=MaxPageTextCount; xCounter++)
		{
			//load text into target
			//console.log(xCounter+" "+PageTextArrayTime[xCounter]+ " -- "+PageTextArrayTime[xCounter+1]);
			if ( (xCounter<MaxPageTextCount) && (CurrentTextFrame!==xCounter) && (CurrentPosition>=PageTextArrayTime[xCounter]) && (CurrentPosition<PageTextArrayTime[xCounter+1]) )
			{
				$(".textlink").off('click');
				$(".maillink").off('click');

				if (CurrentTextFrame==0)
				{
					CurrentTextFrame=xCounter;
					$("#"+PageTextArrayTarget[CurrentTextFrame]).html( PageTextArray[CurrentTextFrame] ).hide().fadeIn( PageTextArrayFadeSpeed[CurrentTextFrame], function() {
						attachClickAction();
					} );
				} else
				{
					CurrentTextFrame=xCounter;

					if (PageTextArrayInsert[CurrentTextFrame]=="popupdialog")
					{
						VideoPopopStyle = "content";
						ShowStandardDialog(PageTextArrayTarget[CurrentTextFrame]);
					}

					if (PageTextArrayInsert[CurrentTextFrame]=="quizdialog")
					{
						VideoPopopStyle = "quiz";
						ShowQuizDialog(PageTextArrayTarget[CurrentTextFrame]);
					}

					if (PageTextArrayInsert[CurrentTextFrame]=="quizdialog_popupfeedback")
					{
						VideoPopopStyle = "quiz";
						ShowQuizDialog_v2(PageTextArrayTarget[CurrentTextFrame]);
					}


					if (PageTextArrayInsert[CurrentTextFrame]=="insert")
					{
						$("#"+PageTextArrayTarget[CurrentTextFrame]).append( $(PageTextArray[CurrentTextFrame]).hide().fadeIn( PageTextArrayFadeSpeed[CurrentTextFrame], function() {
							attachClickAction();
						} ) );
					} else

					if (PageTextArrayInsert[CurrentTextFrame]=="overwrite")
					{
						$("#"+PageTextArrayTarget[CurrentTextFrame]).fadeOut( PageTextArrayFadeSpeed[CurrentTextFrame], function(){
//							var t = $("<div class="\"overlay_item\"" id="\"item_"+i+"\"">"+items[i][2]+"</div>");    t.hide();
							$("#"+PageTextArrayTarget[CurrentTextFrame]).html( PageTextArray[CurrentTextFrame] ).hide().fadeIn( PageTextArrayFadeSpeed[CurrentTextFrame], function() {
								attachClickAction();
							} );
						});
					} else

					if (PageTextArrayInsert[CurrentTextFrame]=="hide")
					{
						$("#"+PageTextArrayTarget[CurrentTextFrame]).hide();
					} else
						
					if (PageTextArrayInsert[CurrentTextFrame]=="show")
					{
						$("#"+PageTextArrayTarget[CurrentTextFrame]).html( PageTextArray[CurrentTextFrame] ).show( function() {
								attachClickAction();
						});
					} else

					if (PageTextArrayInsert[CurrentTextFrame]=="fadeout")
					{
						$("#"+PageTextArrayTarget[CurrentTextFrame]).fadeOut( PageTextArrayFadeSpeed[CurrentTextFrame] );
					}
						
				}
			} else
			if ( (xCounter==MaxPageTextCount) && (CurrentTextFrame!=xCounter) && (CurrentPosition>=PageTextArrayTime[xCounter]) )
			{
				CurrentTextFrame=xCounter;

				$(".textlink").off('click');
				$(".maillink").off('click');

				$("#"+PageTextArrayTarget[CurrentTextFrame]).fadeOut('fast', function(){
					$("#"+PageTextArrayTarget[CurrentTextFrame]).html( PageTextArray[CurrentTextFrame] ).fadeIn( PageTextArrayFadeSpeed[CurrentTextFrame] ,function(){
						attachClickAction();
					});
				});
			}
		}
	}
}



//------------------------------------------------------------------------------------------------------------------
//pages in combobox have divID starting with C then rownumber
//module names also have row number increased and start with C
//LoadPage takes the ID and checks that the ModulePageArray
//the ModulePageArray contains names of Pages and Modules
//if it is a module then it has a M insert in front of it if it
//is a Page it has a L inserted in front of the name.
//So if the selected ID row in the Array starts with "M" it will
//select the next row which has to be a Page. And also highlight this next row.
//If the selected ID Row in the Array start with "L" then it will
//look backwards to find the modules name for the page but will highlight the selected row.

//This way calling LoadPage with ActivePageID + 1 will autoadvance and
//even if it is a module it will skip it properly.

//------------------------------------------------------------------------------------------------------------------
function LoadPage(PageID,PositionX,VariableForTextMode,ForcePlay)
{

//	console.log(PageID+" - "+PositionX+" - "+VariableForTextMode+" - "+ForcePlay);
	isPlayX = isPlay;
	$("#video-progress-bar-time-done").html("&nbsp;0:00&nbsp;");
	$("#video-progress-bar-time-left").html("&nbsp;-0:00&nbsp;");
	$("#video-progress-bar-middle").width(+"1px" );
	$("#video-progress-bar").hide();
	$("#jplayer_video").hide();
	MSIE8_Fix_ClearMedia = true;
	$("#jplayer_video").jPlayer( "clearMedia" );
	$("#ajax-loading-graph").hide();
	$("#ajax-poster").hide();

	$("#FadeOutBackgroundDiv").hide();
	$("#FreeFormDialogDiv").hide();

	$(".textlink").off('click');
	$(".maillink").off('click');
	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}

	if (PageID<1)	{ PageID = 1;	}
	if (PageID>MaxModulePage)	{ PageID = MaxModulePage;	}

	//check if there is a minimum time requirment, if so show message when user tries to enter last page
	if ( (admin_MinTime>0) && (admin_ShowTimer) && (CourseTotalSeconds<(admin_MinTime*60)) && (PageID==MaxModulePage))
	{
		PageID = MaxModulePage-1;
		alert(admin_MinTimeMessage.replace("%%MinTime",admin_MinTime));
	}


	if (ModulePageViewableArray[PageID]==0) { PageID = PageID-1; }
	
	//remove previously selected row from combobox
	$("#"+PageRowDivID).removeClass("page-select-text-line-style-active");

	if (ModulePageArray[PageID].charAt(0)=="M") //goto first page of module show page and module
	{
		selectedModuleID = parseInt( PageID,10 );
		selectedPageID = selectedModuleID+1;
	} else
	if (ModulePageArray[PageID].charAt(0)=="L") //find name of module and open page
	{
		selectedModuleID = 1;
		selectedPageID = parseInt(PageID,10);
		j = selectedPageID;
		while ((ModulePageArray[j].charAt(0)!="M") && (j>1)) { j--; }
		selectedModuleID = j;
	}

	//skip the video intro page if it is second load
	if ( (ModulePageArrayType[selectedPageID]=="iPadOnly") && (isiPad) && (!isiPadFirstTimeLoad) )
	{
		selectedPageID++;
	}
	
	//use selectedPageID not pageID, as pageID might be on a module name in which case it is actually +1

	if ((ModulePageArrayType[selectedPageID]=="FinalExam") && (selectedPageID==MaxModulePage))
	{ 
		//if last page is final exam then do nothing as the final exam closing dialog will do the scorm postings and course complete posting
	} else
	{
		if ((selectedPageID==MaxModulePage) && (QuizMaxScore==0)) { //QuizMaxScore==0 is for courses that do not have final exam or quiz that posts to scorm, QuizMaxScore is initiliazed as 0 and will be set to 99 for course with final exam and will be adjust for courses with the first quiz type
			if (admin_UseAicc) { SetLessonPassed_AICC(100,true);  } else { SetLessonPassed(100,true);  }
			if (admin_UseAicc) { SetScormCoursePassed_AICC();  } else { SetScormCoursePassed();  }
		} 
		else 
		if (selectedPageID==MaxModulePage) { //if course has quiz or final exam, and you get to the last page then send the scorm course passed function
			if (admin_UseAicc) { SetScormCoursePassed_AICC();  } else { SetScormCoursePassed();  }
		} //at last page call SetLessonPassed to make course passed
	}

	if (getParameterByName("bookmark")!="")
	{
		LastBookmark = getParameterByName("bookmark");
	}

	if ((LastBookmark!="") && (FirstLoad))
	{
		var LastBookmarks=LastBookmark.split("-");
		//console.log(LastBookmarks.length+" "+LastBookmarks[0]+" "+LastBookmarks[1]);

		if (admin_ReviewMode)
		{
			for (i=1;i<=MaxModulePage;i++ )
			{
				ModulePageViewableArray[i] = 1;
				$("#C"+(i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
			}

		}

		if (LastBookmarks.length==3)
		{
			if (getParameterByName("bookmark")!="")
			{
				//do nothing if use querystring to bookmark
			} else
			{
				for (i=1;i<=LastBookmarks[1];i++ )
				{
					ModulePageViewableArray[i] = 1;
					$("#C"+(i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
				}
			}

			selectedModuleID = parseInt(LastBookmarks[0],10);
			selectedPageID = parseInt(LastBookmarks[1],10);
		}
		FirstLoad = false;
	}

	$("#module-name").html( ModulePageArray[selectedModuleID].slice(1) );
	$("#page-combo").html( ModulePageArray[selectedPageID].slice(1) );

	//add style to new row and save its ID
	PageRowDivID="C"+selectedPageID;
	$("#"+PageRowDivID).addClass("page-select-text-line-style-active");

	//find the pages real position skipping counting for the rows with module names to update the progressbar
	j = 0;
	k = 0;
	while ( j<selectedPageID ) {
		j++;
		if (ModulePageArray[j].charAt(0)=="L") { k++; }
	}
	CurrentPageNumber = k;

	$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
	$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");

	if (CurrentPageNumber<=1) {
		$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
	}

	if (CurrentPageNumber>=PageCount)
	{
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	$(CourseXML).find("Modules").each(function() {

		$(CourseXML).find("Module").each(function() {
			//console.log("!! "+ 'M'+$(this).attr("Name") + " "+ ModulePageArray[selectedModuleID]+" "+selectedModuleID);

			if ('M'+$(this).attr("Name") == ModulePageArray[selectedModuleID] )
			{
				$(this).find("Page").each(function() {

					if ('L'+$(this).attr("Name") == ModulePageArray[selectedPageID] )
					{
						if (getParameterByName("bookmark")!="")
						{
							console.log(selectedModuleID+"-"+selectedPageID+"-0");
						}
                                            
						if (admin_UseAicc) { UpdateBookmark_AICC( selectedModuleID, selectedPageID+"-0" ); } else { UpdateBookmark( selectedModuleID, selectedPageID+"-0" ); }

						if ((homecode!="") && (FirstHomeCall)) {
							FirstHomeCall = false;
							$.ajax({url:GibberishAES.dec( homecode , "IEngine")+"&cm=V&m="+selectedModuleID+"&p="+selectedPageID, dataType: 'jsonp',	success:function(json){	}, error:function(){ }	});
						}

						$("#jquery_jplayer_1").jPlayer("stop");
						$("#Background_Audio_Player").jPlayer("stop");

						if (ModulePageArrayType[selectedPageID]=="FlatQuiz")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = true;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;


							//enable buttons
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

							DrawFlatQuiz();

						} else
						if (ModulePageArrayType[selectedPageID]=="InteractiveQuiz")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = true;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							//disable buttons
							$("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");

							//enable buttons
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

							DrawInteractiveQuiz();

						} else
						if (ModulePageArrayType[selectedPageID]=="Flash")
						{
							FlashMode = true;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							//enable buttons
							$("#replay-button").removeClass("replay-button-disabled-style").addClass("replay-button-style");
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
							
							GamificationShowInGameScore = $(this).attr("GamificationShowInGameScore");
							if (typeof GamificationShowInGameScore=="undefined") { GamificationShowInGameScore=false; } else { GamificationShowInGameScore=true; } ;

							GamificationLastQuestion = $(this).attr("GamificationLastQuestion");
							if (typeof GamificationLastQuestion=="undefined") { GamificationLastQuestion=false; } else { GamificationLastQuestion=true; } ;
							
							SetupFlash( $(this).find("FlashForVideo") );

						} else
						if (ModulePageArrayType[selectedPageID]=="FinalExam")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = true;
							PreExamMode = false;
							SurveyMode = false;
							
							//increment the retry counter for current exam section
							if (typeof admin_QuizRetakeCounter[ $(this).attr("Group") ] !== 'undefined') { admin_QuizRetakeCounter[ $(this).attr("Group") ]++; } else { admin_QuizRetakeCounter[ $(this).attr("Group") ] = 1; }
							RebuildFinalExamArray();

							//disable buttons
							$("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");

							//enable buttons
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);
							
							if (!admin_ReviewMode)
							{
								$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
								$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
							}
							

							SetupFinalExam($(this).attr("Group"));
						} else
						if (ModulePageArrayType[selectedPageID]=="PreExam")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = true;
							SurveyMode = false;
							
							//disable buttons
							$("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");

							//enable buttons
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

							if (!admin_ReviewMode)
							{
								$("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
								$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
							}

							SetupPreExam();
						} else
						if (ModulePageArrayType[selectedPageID]=="Survey")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = true;
							
							//disable buttons
							$("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");

							//enable buttons
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

							SetupSurvey();
						} else
						if (ModulePageArrayType[selectedPageID]=="Policy")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = false;
							FlatQuizMode = false;
							PolicyMode = true;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							if (ModulePageViewableArray[selectedPageID+1]!=1)
							{
								$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
							}


							//disable buttons
							$("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");

							//enable buttons
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

							DrawPolicy();

						} else
						if (ModulePageArrayType[selectedPageID]=="Slide")
						{
							FlashMode = false;
							QuizMode = false;
							SlideMode = true;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							//disable buttons
							$("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");

							//enable buttons
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//open next chapter
							if (selectedPageID<MaxModulePage)
							{
								if (ModulePageViewableArray[selectedPageID+1]!=1)
								{
					//				ModulePageViewableArray[selectedModuleID] = -99;
									ModulePageViewableArray[selectedPageID+1] = 1;
									$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

									if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
									{
										ModulePageViewableArray[selectedPageID+2] = 1;
										$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
									}
								}
							}

							//load page template
							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							isPlay = 1;
							$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
							$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

							DrawSlide();

						} else
						if (ModulePageArrayType[selectedPageID]=="Quiz")
						{
							$("#jquery_jplayer_1").jPlayer("stop");
							$("#Background_Audio_Player").jPlayer("stop");

							//disable buttons
							$("#play-button").removeClass("pause-button-style").addClass("play-button-style");

							$("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");
							$("#play-button").removeClass("play-button-style").addClass("play-button-disabled-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-style").addClass("autoforward-button-disabled-style"); }
							$("#mode-button").removeClass("mode-button-style").addClass("mode-button-style-offline");

							if (!admin_ReviewMode)
							{
								$("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
								$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
							}


							FlashMode = false;
							QuizMode = true;
							SlideMode = false;
							FlatQuizMode = false;
							PolicyMode = false;
							FinalExamMode = false;
							PreExamMode = false;
							SurveyMode = false;

							CurrentTemplateID = $(this).attr("Template");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							DrawModule(1);
							$("#ajax-loading-graph").fadeOut('slow');
							$("#ajax-poster").hide();
//							$("#jplayer_video").find('img').css({'display':'none'});
						} else
						{
							QuizMode = false;
							SlideMode = false;
							PolicyMode = false;
							FlatQuizMode = false;
							FinalExamMode = false;
							FlashMode = false;
							PreExamMode = false;
							SurveyMode = false;

							//reset flash mode variables
							FlashXMLCodePause = false;
							FlashFinished = false;


							$("#jquery_jplayer_1").jPlayer("stop");
							$("#Background_Audio_Player").jPlayer("stop");

							//enable buttons
							$("#replay-button").removeClass("replay-button-disabled-style").addClass("replay-button-style");
							$("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
							if (admin_AutoForwardEnabled) { $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style"); }
							$("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

							//Load Page Text Fields into Arrays
							MaxPageTextCount = 0;
							$(this).find("Text").each(function() {
								MaxPageTextCount++;
								PageTextArray[MaxPageTextCount] = $(this).text();
								xTime = $(this).attr("TimeToShow");
								xTimes = xTime.split(":");

								PageTextArrayTime[MaxPageTextCount] = parseInt(xTimes[0]*3600,10) + parseInt(xTimes[1]*60,10) + parseInt(xTimes[2],10);
								PageTextArrayTarget[MaxPageTextCount] = $(this).attr("Target");

								PageTextArrayFadeSpeed[MaxPageTextCount] = parseInt($(this).attr("FadeSpeed"),10);
								if (typeof $(this).attr("FadeSpeed") =="undefined") { PageTextArrayFadeSpeed[MaxPageTextCount]=250 };

								PageTextArrayInsert[MaxPageTextCount] = $(this).attr("Insert").toLowerCase();
							});
							CurrentTextFrame=0;
							PositionX=0;
							CurrentPosition=0;


							//load page template
							CurrentTemplateID = $(this).attr("VideoTemplate");
							$("#template-place").html( TemplateArray[CurrentTemplateID] );

							//load first keyframe
							UpdateTextArea(1);
							CurrentTextFrame=0;
							CurrentPosition = 0;

							//setup video

							if ( TemplateArrayHasVideo[ CurrentTemplateID ] )
							{
								var VideoImageFile = $(this).attr("VideoImage");

								//init audio for tablets
								InitAudio = $(this).attr("TabletInitAudio");
								if (typeof InitAudio=="undefined") { InitAudio="xmls/"+CourseLanguage+"/audio/click.mp3"; };

								if ((isiPad) && ($(this).attr("IpadVideoImage")!=null)) { var VideoImageFile = $(this).attr("IpadVideoImage"); }
								var m4vFile ="";
								var WebmFile = "";
								$(this).find("Mode").each(function() {
									if (CurrentMode == $(this).attr("Level") ) {

										tempStrX = $(this).attr("File");
										tempStrX2 = tempStrX.split(",");

										//single file
										if (tempStrX2.length==1) {
											if ( tempStrX2[0].search(".mp4")!==-1 ) { m4vFile = tempStrX2[0]; if (m4vFile.search("://")==-1) { m4vFile = cleanURL(document.URL)+m4vFile+""; }  }
											if ( tempStrX2[0].search(".webm")!==-1 ) { WebmFile = tempStrX2[0]; if (WebmFile.search("://")==-1) { WebmFile = cleanURL(document.URL)+WebmFile+""; } }
										}

										//dual file
										if (tempStrX2.length==2) {
											if ( tempStrX2[0].search(".mp4")!==-1 ) { m4vFile = tempStrX2[0]; if (m4vFile.search("://")==-1) { m4vFile = cleanURL(document.URL)+m4vFile+""; }  }
											if ( tempStrX2[0].search(".webm")!==-1 ) { WebmFile = tempStrX2[0]; if (WebmFile.search("://")==-1) { WebmFile = cleanURL(document.URL)+WebmFile+""; } }

											if ( tempStrX2[1].search(".mp4")!==-1 ) { m4vFile = tempStrX2[1]; if (m4vFile.search("://")==-1) { m4vFile = cleanURL(document.URL)+m4vFile+""; }  }
											if ( tempStrX2[1].search(".webm")!==-1 ) { WebmFile = tempStrX2[1]; if (WebmFile.search("://")==-1) { WebmFile = cleanURL(document.URL)+WebmFile+""; } }
										}

										if (VideoImageFile.search("://")==-1) { VideoImageFile = cleanURL(document.URL)+VideoImageFile+""; }
									}
								});


								InitVideo(m4vFile,WebmFile+"",VideoImageFile+"",ForcePlay);

							}
						}
					}
				});
			}
		});
	});

	$(".textlink").on('click', function()
	{
		VideoPopopStyle = "content";
		ShowStandardDialog($(this).data('dialog'));
		return false;
	});
	$(".maillink").on('click', function()
	{
		if ((CourseMode=="Video") && (!FlashMode)) {
			$("#jplayer_video").jPlayer("pause" );
			isPlay = 0;
			$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
			$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
		}

		var link = 'mailto.html#mailto:' + $(this).data('mailto');
		window.open(link, 'Mailer');
		return false;
	});


	UpdateProgressBar();

}

//------------------------------------------------------------------------------------------------------------------
function PageClick(e)
{
	if ((QuizMode) && (!admin_ReviewMode)) { return false; }

	CloseQuizDialogs();

	if (ModulePageViewableArray[e.target.id.slice(1)]!=1)
	{
		alert(admin_DropDownAlert);
	} else

	if (isPageComboOpen==true) {
		isPageComboOpen = false;
		$("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
		$("#page-select").hide('slide', { direction: 'up' }, 350);
		$("#page-select-text").css('margin-bottom','1px');

		FlashAbortTimer();
		FlashTime=-1;

		LoadPage( e.target.id.slice(1),0,0,true );
	}
}

//------------------------------------------------------------------------------------------------------------------
function AutoForwardClick()
{
	if ((QuizMode) && (!admin_ReviewMode)) { return false; }
	if ( $("#autoforward-button").hasClass("autoforward-button-disabled-style") ) { return false; }

	if (admin_AutoForwardDefaultSetting==false)
	{
		admin_AutoForwardDefaultSetting = true;
		$("#autoforward-button").removeClass("noautoforward-button-style").addClass("autoforward-button-style");
		$("#autoforward-button").attr('alt',admin_AutoForwardText);	$("#autoforward-button").attr('title',admin_AutoForwardText);
	} else

	if (admin_AutoForwardDefaultSetting==true)
	{
		admin_AutoForwardDefaultSetting = false;
		$("#autoforward-button").removeClass("autoforward-button-style").addClass("noautoforward-button-style");
		$("#autoforward-button").attr('alt',admin_NoAutoForwardText);	$("#autoforward-button").attr('title',admin_NoAutoForwardText);
	}

}


//------------------------------------------------------------------------------------------------------------------
function GlossaryItemClick(e)
{
	if ((QuizMode) && (!admin_ReviewMode)) { return false; }

	//console.log(e.target.id);
	$("#"+GlossarySelectID).removeClass("glossary-select-text-line-style-active");
	GlossarySelectID=e.target.id;

	GlossaryTermID = GlossarySelectID.slice(9);
	$("#glossary-description").html( GlossaryTerms[GlossaryTermID] );

	$("#"+GlossarySelectID).addClass("glossary-select-text-line-style-active");

	//load page data and video
}


//------------------------------------------------------------------------------------------------------------------
function InitVideoPlayer()
{
	//initilaze with flash as default on MSIE 9
	if ( ($.browser.msie  && parseInt($.browser.version, 10) === 9)  ) //|| ( (isThisFirefox()) && (isThisMac()) ) no longer needed as mac firefox supports mp4
	{
		
		$("#jplayer_video").jPlayer({
			swfPath: "jplayer",
			solution:"flash,html",
			supplied: "m4v,webmv",
			preload:"auto",
			size: {height:"280px",width:"780px"},
			volume: VolumeValue/100,
			errorAlerts:false
		});
	} else
	{
		$("#jplayer_video").jPlayer({
			swfPath: "jplayer",
			solution:"html,flash",
			supplied: "m4v,webmv",
			preload:"auto",
			size: {height:"280px",width:"780px"},
			volume: VolumeValue/100,
			errorAlerts:false
		});
	}

	$("#ajax-loading-graph").css({"top": ((parseInt(TemplateVideoHeight[CurrentTemplateID],10)/2)+55)+"px" }); //140+55 = 195
	$("#ajax-loading-graph").css({"left": ((parseInt(TemplateVideoWidth[CurrentTemplateID],10)/2))+"px"}); //390px before


	$("#jplayer_video").bind($.jPlayer.event.waiting,  function(event) {
		$.doTimeout( '', 25, function(){ $("#ajax-loading-graph").show(); $("#ajax-poster").show();  });
		if (event.jPlayer.status.currentTime<1)	{ }
	});

	$("#jplayer_video").bind($.jPlayer.event.playing,  function(event) {
		$("#ajax-loading-graph").fadeOut('slow');
		$("#ajax-poster").hide();
	});

	$("#jplayer_video").bind($.jPlayer.event.paused,  function(event) {
		isPlay = 0;
		$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
		$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
	});

	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}
	$("#jplayer_video").bind($.jPlayer.event.ended,
		function(event) {
			//in flash mode loop video
			if ((FlashMode) ) {
				if (SequencerVideoEndGoTo!=0)
				{
					if (SequencerVideoEndBlank) {
						$("#jplayer_video").hide(); //hide video player
					}
					SeqGoToAndPlay(SequencerVideoEndGoTo); //jump to timefreme
				} else
				{
					if (SequencerVideoEndBlank) {
						$("#jplayer_video").hide(); //hide video player
					} else
					{
						$("#jplayer_video").jPlayer("play", 0); //loop in flash mode
					}
				}
				
			} else
			{
				if ((admin_AutoForwardDefaultSetting==true) && (selectedPageID<MaxModulePage))
				{
					ForwardClick();
				} else
				{
					isPlay = 0;
					$(this).jPlayer("pause" );
					$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
					$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
					if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
				}
			}
	});


	$("#jplayer_video").bind($.jPlayer.event.timeupdate,
		function(event) {
			//for IE calls here after a video has finished then ignore it
			if ((MSIE8_Fix_ClearMedia) && ($.browser.msie  && parseInt($.browser.version, 10) === 8) )
			{
			} else
			{
				VideoLength = event.jPlayer.status.duration;
				if (!FlashMode) {
					if ((event.jPlayer.status.currentTime > event.jPlayer.status.duration - 1) && (!admin_AutoForwardDefaultSetting) && (event.jPlayer.status.currentTime>5)) {
						$(this).jPlayer("pause");
						if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
					}
				}

				if (event.jPlayer.status.waitForLoad) {
					$.doTimeout( '', 25, function(){
						if ($("#jplayer_video").is(":visible")) { $("#ajax-loading-graph").show(); }

						//msie8 poster not showing bug fix
						if ($.browser.msie  && parseInt($.browser.version, 10) === 8)
						{
							$("#ajax-poster").show();
						}
					});
					if (event.jPlayer.status.currentTime<1)	{ }
				} else
				{
					$("#ajax-loading-graph").fadeOut('slow');
					if (!isiPadFirstTimeLoad) { $("#ajax-poster").hide(); }
				}

				CurrentPosition =   Math.floor(event.jPlayer.status.currentTime);
				if (!FlashMode) {
					UpdateTextArea(0);
					$("#video-progress-bar-middle").width(Math.round( ((admin_ProgressWidth+4-80) * (event.jPlayer.status.currentTime/event.jPlayer.status.duration) ))+"px" );

					$("#video-progress-bar-time-done").html("&nbsp;"+ $.jPlayer.convertTime(event.jPlayer.status.currentTime) +"&nbsp;");
					$("#video-progress-bar-time-left").html("&nbsp;-" + $.jPlayer.convertTime(event.jPlayer.status.duration-event.jPlayer.status.currentTime) +"&nbsp;");

					//if viewtime is more than MinTime from XML unlock next chapter
					if (selectedPageID<MaxModulePage)
					{
						if (CurrentPosition>ModulePageMinTimeArray[selectedPageID])
						{
							if (ModulePageViewableArray[selectedPageID+1]!=1)
							{
								ModulePageViewableArray[selectedPageID+1] = 1;
								$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

								if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
								{
									ModulePageViewableArray[selectedPageID+2] = 1;
									$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
								}
							}
						}
					}
				}
			}
	});
}

//------------------------------------------------------------------------------------------------------------------
function InitVideo(VideoFile,WebmFile,PosterFile,ForcePlay)
{
	HideVideoProgress();
	var offsetPoster = $('#template-place').position();
	$("#ajax-poster").css({"top": offsetPoster.top + "px" }); //140+55 = 195
	$("#ajax-poster").css({"left": offsetPoster.left + "px" }); //140+55 = 195
	$("#ajax-poster").css({"height": TemplateVideoHeight[CurrentTemplateID]+"px" });
	$("#ajax-poster").css({"width": TemplateVideoWidth[CurrentTemplateID]+"px" });
	$("#ajax-poster").attr("src",PosterFile);
	$("#ajax-poster").css({"z-index":4});

	$("#jplayer_video").css({"top": offsetPoster.top + "px" }); //140+55 = 195
	$("#jplayer_video").css({"left": offsetPoster.left + "px" }); //140+55 = 195
	$("#jplayer_video").css({"z-index":3});

	MSIE8_Fix_ClearMedia = false;
	$("#jplayer_video").jPlayer( "clearMedia" );
	$("#jplayer_video").jPlayer( "option", "size", { height: TemplateVideoHeight[CurrentTemplateID]+"px",width: TemplateVideoWidth[CurrentTemplateID]+"px" } );


	if (isiPadFirstTimeLoad)
	{
		$.doTimeout( '', 25, function(){ $("#ajax-loading-graph").show(); $("#ajax-poster").show(); });

		//load dummy audio file so they will play later first time only on tablets with media problems, only jplayer_1 as background audio wont work on tablets
		$("#jquery_jplayer_1").jPlayer("setMedia", { mp3: InitAudio });
	}

//	$("#ajax-poster").show();

	$("#jplayer_video").jPlayer("setMedia", {m4v:VideoFile,webmv:WebmFile}); //,poster:PosterFile
	$("#jplayer_video").show();

	if (!admin_DisableVolume)
	{
		if (VolumeMute)
		{
			$("#jplayer_video").jPlayer("mute", true );
		} else
		{
			$("#jplayer_video").jPlayer("mute", false );
		}
	}

	if ( (KeyCode.indexOf(XCode)==-1) && (KeyCode.indexOf(XCode2)==-1) && (KeyCode.indexOf(XCode3)==-1)) { 
		if (DialogIsVisible) { 
			window.location.href=admin_L_URL;  
			return false; 
		} 
	}

	$("#video-progress-bar-middle").width("1px" );
	VideoLength = 0;

	if ( TemplateArrayHasVideo[ CurrentTemplateID ] )
	{
		if ( ((admin_AutoForwardDefaultSetting) || (ForcePlay) || (FirstTimeLoad) ) && (!isiPadFirstTimeLoad) )
		{
			if (FirstTimeLoad)
			{
				FirstTimeLoad = false;

				//for IE some bug makes first video not play at all but releoad works so we will reload the page after 1 second only for MSIE version 8
				//21.09.2013 -- added same code for MSIE 8 since it is forced to flash and same bug happens then
				if  ( (($.browser.msie  && parseInt($.browser.version, 10) === 8) || ($.browser.msie  && parseInt($.browser.version, 10) === 10) || ($.browser.msie  && parseInt($.browser.version, 10) === 9) ) || ( (isThisSafari()) && (!isiPad) ) || ( (isThisFirefox()) && (isThisMac()) ) ) {
					$.doTimeout( '', 1000, function(){ LoadPage(selectedPageID,0,0,true);  });
				}
			}

			if ( (isThisSafari()) && (!isiPad) )
			{
				$.doTimeout( '', 1000, function(){ $("#jplayer_video").jPlayer("play", 0);  });
			}

			isPlay = 1;
			$("#jplayer_video").jPlayer("play" );
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

			//alert(VideoFile+" "+WebmFile );

		} else
		{
			isPlay = 0;
			$("#jplayer_video").jPlayer("pause" );
			$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
			$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
		}
	}


	$("#video-progress-bar").css('top',(parseInt(TemplateVideoHeight[CurrentTemplateID],10)+62)+"px");
	$("#video-progress-bar").width(Math.round((admin_ProgressWidth+5))+"px" );
	$("#ajax-loading-graph").css({"top": ((parseInt(TemplateVideoHeight[CurrentTemplateID],10)/2)+55)+"px" }); //140+55 = 195
	$("#ajax-loading-graph").css({"left": ((parseInt(TemplateVideoWidth[CurrentTemplateID],10)/2))+"px"}); //390px before

	$("#video-progress-bar").unbind('mouseover');
	$("#video-progress-bar").unbind('mouseout');
	$("#video-progress-bar").unbind('click');

	$("#video-progress-bar").bind('mouseover', function() { MouseOnProgressBar = true; clearTimeout(VideoProgressTimer); }  );
	$("#video-progress-bar").bind('mouseout', function() { MouseOnProgressBar = false; clearTimeout(VideoProgressShowTimer); VideoProgressTimer = setTimeout('HideVideoProgress()',800); }  );

	$("#video-progress-bar").bind('click',function(e) {
		if (admin_VideoProgressCanMove)
		{
			var offsetX = $(this).offset();
			var offsetY = $("#video-progress-bar-middle").position();
			var PositionX = (e.clientX - offsetX.left - offsetY.left);
			if (PositionX<0) {PositionX=0;}
			if (PositionX> (admin_ProgressWidth+4-80) ) {PositionX=(admin_ProgressWidth+4-80);}

			var targetSecond = Math.round( PositionX / (admin_ProgressWidth+4-80) * VideoLength);
			if (targetSecond>=VideoLength) {targetSecond=VideoLength-3;}
			$("#jplayer_video").jPlayer("play", targetSecond);

			isPlay = 1;
			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

			$.doTimeout( '', 25, function(){ $("#ajax-loading-graph").show(); });
			CurrentTextFrame=0;
		}
	} );


}


//------------------------------------------------------------------------------------------------------------------
function InitCourseTimer()
{
	if ((MaxModulePage>0) && (PageCount>0))
	{
		ModulePageViewableArray[1] = 1;
		$("#C1").removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
		ModulePageViewableArray[2] = 1;
		$("#C2").removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

		ChangeMode(CurrentMode);

		$(".page-select-text-line-style").bind('click', function(event) { PageClick(event); } );
		$(".page-disabled-text-line-style").bind('click', function(event) { PageClick(event); } );
	} else
	{
		$.doTimeout( '', 200, function(){ InitCourseTimer(); } );
	}
}


//------------------------------------------------------------------------------------------------------------------
function RebuildFinalExamArray()
{
	//build final exam
	FinalExamQArray = [];
	FinalExamGroupMaxQuestions = [];
	FinalExamGroupMaxQuestionsByOrder = [];
	
	/*
	FinalExamAnswerCache = [];
	FinalExamAnswerTextCache = [];
	FinalExamAnswerRightCache = [];
	FinalExamScormUserAnswerCache = [];

	FinalExamScormQuestionCache = [];
	FinalExamScormAnswersCache = [];
	FinalExamScormCorrectAnswerCache = [];
	*/
	
	
	QuestionCounter = 0;
	FinalExamMaxQuestions = 0;
	FinalExamCurrentActiveQuestion = 0;
	
	QuestionGroupCounter = -1; //zero based counter so first group is 0
	
	$(FinalXML).find("QuestionGroup").each(function()
	{
		if (typeof admin_QuizRetakeCounter[ $(this).attr("Name") ] !== 'undefined') {} else { admin_QuizRetakeCounter[ $(this).attr("Name") ] = 1; }
//		console.log(admin_QuizRetakeCounter[ $(this).attr("Name") ]+" "+$(this).attr("Name"));

		FinalExamMaxQuestions += parseInt($(this).attr("QuestionCount"),10);
		
		QuestionGroupCounter++;
		QGroup = $(this).attr("Name");
		
		//loop through each group pull questions revelant to retry counter into array
		QCount = 0;
		
		if (typeof admin_QuizRetakeCounter[ $(this).attr("Name") ] !== 'undefined') { 
			QArrayCounter = (admin_QuizRetakeCounter[ $(this).attr("Name") ]-1) * parseInt($(this).attr("QuestionCount"),10);
		
		} else { 
			QArrayCounter = 0;
		}
		
		//console.log(QArrayCounter+" - "+$(this).attr("Name")+" - "+admin_QuizRetakeCounter[$(this).attr("Name")]+" - "+parseInt($(this).attr("QuestionCount"),10))
		
		if ((QArrayCounter+1) >$(this).find("Question").length) { QArrayCounter = 0; }
		
		FinalExamGroupMaxQuestions[ QGroup ] = parseInt($(this).attr("QuestionCount"),10);
		FinalExamGroupMaxQuestionsByOrder[ QuestionGroupCounter ] = parseInt($(this).attr("QuestionCount"),10);
		
		while (QCount < parseInt($(this).attr("QuestionCount"),10) )
		{
			NewQ = new Object();
			NewQ.position = QCount;
			NewQ.groupPosition = QArrayCounter;
			NewQ.questionNo = QuestionCounter;
			NewQ.group = QGroup;
			NewQ.GroupCounter = QuestionGroupCounter;
			
			FinalExamQArray.push(NewQ); 

			QuestionCounter++;
		
			QCount++;
			QArrayCounter++;
			if ((QArrayCounter+1)>$(this).find("Question").length) { QArrayCounter = 0; }
		}
	});
	
}


//------------------------------------------------------------------------------------------------------------------
function SaveFinalXML(xml)
{
	FinalXML = xml;
	//set quizmaxscore to more than zero so last page will post course complete and not 100%
	QuizMaxScore=99;
	
}

//------------------------------------------------------------------------------------------------------------------
function LoadFinalXML(FinalFileName)
{
	$.ajax({
		type: "GET",
		async:   false,
		url: FinalFileName+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveFinalXML
	});
}


//------------------------------------------------------------------------------------------------------------------
function SavePreExamXML(xml)
{
	PreExamXML = xml;
}

//------------------------------------------------------------------------------------------------------------------
function LoadPreExamXML(PreExamFileName)
{
	$.ajax({
		type: "GET",
		async:   false,
		url: PreExamFileName+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SavePreExamXML
	});
}

//------------------------------------------------------------------------------------------------------------------
function SaveSurveyXML(xml)
{
	SurveyXML = xml;
}

//------------------------------------------------------------------------------------------------------------------
function LoadSurveyXML(SurveyFileName)
{
	$.ajax({
		type: "GET",
		async:   false,
		url: SurveyFileName+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveSurveyXML
	});
}

//------------------------------------------------------------------------------------------------------------------
function parseCourseXml(xml)
{

	//find every Tutorial and print the author

	$(xml).find("Template").each(function() {
		TemplateArray[ $(this).attr("Name") ] = $(this).text();
		TemplateArrayHasVideo[ $(this).attr("Name") ] = ( $(this).attr("HasVideo")=="true");

		TemplateVideoWidth[ $(this).attr("Name") ] = $(this).attr("VideoWidth");
		TemplateVideoHeight[ $(this).attr("Name") ] = $(this).attr("VideoHeight");
	});



	$(xml).find("ModeValues").each(function() {
		$(this).find("Mode").each(function() {
			var StartMuteStr = "F";
			var StartMute = $(this).attr("StartMute");
			if (typeof StartMute=="undefined") { StartMuteStr="F"; } else { StartMuteStr="T"; };
			
			if ($(this).attr("Value")==getParameterByName("mode")) { CurrentMode = "Q"+StartMuteStr+$(this).attr("Value"); }
			
			$("#mode-box").append('<a href="#"  onclick="return false;" style="display:block" id="Q'+StartMuteStr+$(this).attr("Value")+'" class="mode-settings-style">'+$(this).attr("Name")+'</a>');
		});
	});


	admin_FinalExamFile = $(xml).find("QuizSetup").attr("FinalFile");
	if (typeof admin_FinalExamFile=="undefined") { } else
	{
		LoadFinalXML(admin_FinalExamFile);
	}

	admin_PreExamFile = $(xml).find("QuizSetup").attr("PreExamFile");
	if (typeof admin_PreExamFile=="undefined") { } else
	{
		LoadPreExamXML(admin_PreExamFile);
	}
	
	admin_SurveyFile = $(xml).find("QuizSetup").attr("SurveyFile");
	if (typeof admin_SurveyFile=="undefined") { } else
	{
		LoadSurveyXML(admin_SurveyFile);
	}
	

	$(".mode-settings-style").bind('click', function(event) { ChangeMode(event.target.id); } );

	admin_QuizPassingPercentage = parseInt($(xml).find("QuizSetup").attr("PassingPercentage"),10);
	admin_QuizRetakeTillPass = $(xml).find("QuizSetup").attr("RetakeTillPass").toLowerCase()==="true";
	admin_QuizRetakeMaxCount = $(xml).find("QuizSetup").attr("RetakeTries");
	if (typeof admin_QuizRetakeMaxCount=="undefined") { admin_QuizRetakeMaxCount=99; } else {admin_QuizRetakeMaxCount = parseInt(admin_QuizRetakeMaxCount,10);  };
	
	GamificationPassingPoints = $(xml).find("QuizSetup").attr("GamificationPassingPoints");
	if (typeof GamificationPassingPoints=="undefined") { GamificationPassingPoints=0; } else {GamificationPassingPoints = parseInt(GamificationPassingPoints,10);  };
	
	admin_ScormOrFinalQuiz = $(xml).find("QuizSetup").attr("ScormPost");

	CourseName = $(xml).find("course").attr("Name");

	if (admin_ReviewMode) { $("#course-header").html(CourseName+" ("+admin_Review+")"); } else {$("#course-header").html(CourseName);}

	PageCount = 0;
	
	$(xml).find("Modules").each(function() {
		$(xml).find("Module").each(function() {

			MaxModulePage++;
			ModulePageArray[MaxModulePage] = 'M'+$(this).attr("Name");

			$("#page-select-text").append('<a href="#"  onclick="return false" style="display:block" id="C'+(MaxModulePage)+'" class="page-disabled-text-line-style">'+ ModulePageArray[MaxModulePage].slice(1) +'</a>');

			ModulePageMinTimeArray[MaxModulePage] = -99;
			ModulePageViewableArray[MaxModulePage] = 0;

			if (admin_ReviewMode) {ModulePageViewableArray[MaxModulePage] = 1;}

			$(this).find("Page").each(function() {
				if ( ($(this).attr("Type")=="iPadOnly") && (!isiPad))
				{
					//ignore ipad only pages
				} else
				{
					MaxModulePage++;
					ModulePageArray[MaxModulePage] = 'L'+$(this).attr("Name");

					ModulePageMinTimeArray[MaxModulePage] = $(this).attr("MinTime");
					if (ModulePageMinTimeArray[MaxModulePage]=="") {ModulePageMinTimeArray[MaxModulePage] = 0; }
					if (ModulePageMinTimeArray[MaxModulePage]== null) {ModulePageMinTimeArray[MaxModulePage] = 0; }
					ModulePageArrayType[MaxModulePage] = $(this).attr("Type");
					ModulePageViewableArray[MaxModulePage] = 0;

					if (admin_ReviewMode) {ModulePageViewableArray[MaxModulePage] = 1;}
					if ( ($(this).attr("Type")=="iPadOnly") && (isiPad))
					{
						$("#page-select-text").append('<a href="#"  onclick="return false" style="display:none" id="C'+(MaxModulePage)+'" class="page-disabled-text-line-style">&nbsp;&nbsp;&nbsp;'+ ModulePageArray[MaxModulePage].slice(1) +'</a>');
						
					} else
					{
						$("#page-select-text").append('<a href="#"  onclick="return false" style="display:block" id="C'+(MaxModulePage)+'" class="page-disabled-text-line-style">&nbsp;&nbsp;&nbsp;'+ ModulePageArray[MaxModulePage].slice(1) +'</a>');
						
					}
					PageCount++;
				}
			});
		});
	});

	//unlock all pages
	if (admin_ReviewMode) {
		for (var i=0; i<MaxModulePage; i++)
		{
			ModulePageViewableArray[i+1] = 1;
			$("#C"+(i+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
		}
	}

	// ****** START COURSE HERE *********
	$.doTimeout( '', 750, function(){
		InitVideoPlayer();
		resizeControls();
		if (admin_UseAicc) { StartCourse_AICC("course"); } else { StartCourse("course"); }
		InitCourseTimer();

		$.doTimeout( '', 1000, function(){ resizeControls(); $.doTimeout( '', 1000, function(){ resizeControls() } ); } );

	} );
}

//------------------------------------------------------------------------------------------------------------------
function SaveCourseXML(xml)
{
	CourseXML = xml;
	parseCourseXml(CourseXML);
}

//------------------------------------------------------------------------------------------------------------------
function LoadCourseXML()
{
	$.ajax({
		type: "GET",
		url: admin_CourseFile+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveCourseXML
	});
}


//------------------------------------------------------------------------------------------------------------------
function parseGlossaryXml(xml)
{
	j = 0;
	$(xml).find("Term").each(function() {
		j++;
		$("#glossary-select-text").append('<a href="#"  onclick="return false" style="display:block" id="Glossary_'+ j + '" class="glossary-select-text-line-style">'+ $(this).attr("Name") +'</a>');
		GlossaryTerms[j] = "<b>"+ $(this).attr("Name") + "</b><p>" +$(this).text();
		if (j==1) {
			$("#Glossary_1").addClass("glossary-select-text-line-style-active");
			$("#glossary-description").html( GlossaryTerms[j] );
		}
	});

	$(".glossary-select-text-line-style").bind('click', function(event) { GlossaryItemClick(event); } );

}

//------------------------------------------------------------------------------------------------------------------
function SaveGlossaryXML(xml)
{
	GlossaryXML = xml;
	parseGlossaryXml(GlossaryXML);
}

//------------------------------------------------------------------------------------------------------------------
function LoadGlossary()
{
	$.ajax({
		type: "GET",
		url: admin_GlossaryFile+'?q=430&time='+Math.round(+new Date()/1000),
		dataType: "xml",
		success: SaveGlossaryXML
	});
}


//------------------------------------------------------------------------------------------------------------------
function initVolumeBox()
{
	if (admin_DisableVolume)
	{
		$("#volume-button").removeClass("volume-button-style").addClass("volume-button-disabled-style");
	} else
	{
		$(document).one('mouseup', function() { VolumeSliderMouseDown=false; } );
		$("#volume-button").bind('click', toggleVolumeMute );
		$("#volume-popup-mute").bind('click', toggleVolumeMute );
		$("#volume-button").bind('mouseover', ShowVolume );
		$("#volume-button").bind('mouseout',function() { VolumeTimer = setTimeout('HideVolume()',500); });

		$("#volume-slider").bind('mousedown',function() {
			VolumeSliderMouseDown=true;
			ChangeVolume(VolumerelativePosition.top);
			if ( TemplateArrayHasVideo[ CurrentTemplateID ] ) { $("#jplayer_video").jPlayer("volume", VolumeValue/100 ); }
			$("#jquery_jplayer_1").jPlayer("volume", VolumeValue/100 );
			$("#Background_Audio_Player").jPlayer("volume", VolumeValue/100 );
		});

		$("#volume-slider").bind('mouseup',function() { VolumeSliderMouseDown=false; });
		$("#volume-slider").mousemove(function(e) { UpdateMouseVolume(e) });

		$("#volume-box").bind('mouseover', ShowVolume );
		$("#volume-box").bind('mouseup', function() { VolumeSliderMouseDown=false; } );
		$("#volume-box").bind('mouseout',function() { VolumeTimer = setTimeout('HideVolume()',500); });

		$("#volume-popup-mute").removeClass("volume-popup-mute-style").addClass("volume-popup-speaker-style");
	}
}


//------------------------------------------------------------------------------------------------------------------
function ExitClick()
{
	if (admin_UseAicc) { CloseCourse_AICC(false); } else { CloseCourse(false); }
}

//------------------------------------------------------------------------------------------------------------------
function ScormTime()
{
	if ( (admin_UseScorm)  && (ScormInitialized) && (!startingTime) )
	{
		//read scorm total time once
		startingTime=true;
		ScormTotalTime = LMSGetValue("cmi.core.total_time");
//			console.log("scorm time:"+ScormTotalTime);
		if (ScormTotalTime=="") { ScormTotalTime = "00:00:00"; }
		if (ScormTotalTime==null) { ScormTotalTime = "00:00:00"; }
//			console.log("scorm time:"+ScormTotalTime);
		var splitTime = ScormTotalTime.split(":");
		ScormTotalHours = parseInt(splitTime[0],10);
		ScormTotalMinutes = parseInt(splitTime[1],10);
		ScormTotalSeconds = parseInt(splitTime[2],10);
	}

	if ( (!startingTime) && (!admin_UseScorm) )
	{
		startingTime=true;
		ScormTotalHours = 0;
		ScormTotalMinutes = 0;
		ScormTotalSeconds = 0;
	}

	if ( (admin_ShowTimer) && (startingTime) )
	{
		$("#scorm-timer-container").show();

		var endtime2=new Date();
		var totaltime2=Math.floor( (endtime2 - CourseStartTime)/1000);

		var totalhours2=Math.floor(totaltime2/3600);

		var totalminutes2=(Math.floor((totaltime2%3600)/60) + ScormTotalMinutes);
		if (totalminutes2 >= 60) { totalhours2++; totalminutes2=totalminutes2-60; }

		var totalseconds2=( Math.floor(totaltime2%60)+ScormTotalSeconds) ;
		if (totalseconds2 >= 60) { totalminutes2++; totalseconds2=totalseconds2-60; }

		CourseTotalSeconds = ( (totalhours2+ScormTotalHours)*3600) + (totalminutes2*60) + (totalseconds2);

		$("#scorm-timer").html(admin_TimerText+LZ((totalhours2+ScormTotalHours))+":"+LZ(totalminutes2)+":"+LZ(totalseconds2) );

	}
	$.doTimeout( '', 1000, function(){	ScormTime()  });

}


function PlayBlink(time, interval){
    PlayButtonBlinkTimer = window.setInterval(function(){
        $("#play-button").css("opacity", "0.1");
        window.setTimeout(function(){
            $("#play-button").css("opacity", "1");
        }, 500);
    }, interval);

	var playtimerblink = window.setTimeout(function(){clearInterval(PlayButtonBlinkTimer);}, time);
}

function FwdBlink(time, interval){
	if (admin_ForwardBlink)
	{
		clearInterval(FwdButtonBlinkTimer);
		clearTimeout(fwdtimerblink);
		FwdButtonBlinkTimer = window.setInterval(function(){
			$("#forward-button").removeClass("forward-button-style").addClass("forward-button-blink-style");
			window.setTimeout(function(){
				$("#forward-button").removeClass("forward-button-blink-style").addClass("forward-button-style");
			}, 500);
		}, interval);

		fwdtimerblink = window.setTimeout(function(){
			clearInterval(FwdButtonBlinkTimer);
			window.setTimeout(function(){
				$("#forward-button").removeClass("forward-button-style").addClass("forward-button-blink-style");
			}, 500);
		}, time);
	}
}




//------------------------------------------------------------------------------------------------------------------
$(document).ready(function() {

	$("#scorm-timer-container").hide();

	var aDate = new Date();
	xcode = $.timerY(aDate.getFullYear()+"."+aDate.getUTCMonth()+"."+aDate.getDate(), 'IEngine');
	XCode = xcode.substring(0,3)+xcode.substr(xcode.length-1,1);

	xcode2 = $.timerY(aDate.getFullYear()+"."+aDate.getUTCMonth()+"."+(aDate.getDate()-1), 'IEngine');
	XCode2 = xcode2.substring(0,3)+xcode2.substr(xcode2.length-1,1);

	xcode3 = $.timerY(aDate.getFullYear()+"."+aDate.getUTCMonth()+"."+(aDate.getDate()+1), 'IEngine');
	XCode3 = xcode3.substring(0,3)+xcode3.substr(xcode3.length-1,1);

	LoadVersionXML();

	//blink play button for first load
	if (isiPadFirstTimeLoad)
	{
		PlayBlink(60000,1000);
	}

	//initilaze with flash as default on MSIE 9
	if ( ($.browser.msie  && parseInt($.browser.version, 10) === 9) ) // || ( (isThisFirefox()) && (isThisMac()) ) -- removed as firefox for mac now supports mp4
	{
		$("#jquery_jplayer_1").jPlayer({
			swfPath: "jplayer",
			solution:"flash,html",
			supplied: "mp3",
			preload:"auto",
			errorAlerts:false
		});

		$("#Background_Audio_Player").jPlayer({
			swfPath: "jplayer",
			solution:"flash,html",
			supplied: "mp3",
			preload:"auto",
			errorAlerts:false
		});
	} else
	{
		$("#jquery_jplayer_1").jPlayer({
			swfPath: "jplayer",
			solution:"html,flash",
			supplied: "mp3",
			preload:"auto",
			errorAlerts:false
		});

		$("#Background_Audio_Player").jPlayer({
			swfPath: "jplayer",
			solution:"html,flash",
			supplied: "mp3",
			preload:"auto",
			errorAlerts:false
		});
	}


	$("body").css("overflow", "hidden");

	$("#tooltip").hide();
	$("#page-select").hide();
	$("#page-select-text").css('margin-bottom','1px');

//		ChangeVolume( VolumeMouseMin+Math.round( (VolumeMouseMax-VolumeMouseMin) * ( (100-VolumeValue) / 100) ) );

	$(document).bind('click', function(e) {
		//close chapter menu
		if (($(e.target).closest('#page-select').length == 0) && ($(e.target).closest('#page-combo').length == 0)) {
			if (isPageComboOpen==true) {
				isPageComboOpen = false;
				$("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
				$("#page-select").hide('slide', { direction: 'up' }, 350);
				$("#page-select-text").css('margin-bottom','1px');
			}
		}

		//close mode menu
		if ( ($(e.target).closest('#mode-box').length == 0) && ($(e.target).closest('#mode-button').length == 0) && ($(e.target).closest('.mode-settings-style').length == 0) ) {
			if (isModeVisible==true)
			{
				toggleModeBox();
			}
		}

		if ( ($(e.target).closest('#glossary-select').length == 0) && ($(e.target).closest('#glossary-button').length == 0) && ($(e.target).closest('.glossary-select-text-line-style ').length == 0)) {
			if (isGlossaryOpen==true)
			{
				isGlossaryOpen = false;
				$("#glossary-button").addClass("glossary-button-style").removeClass("glossary-button-style-active");
				$("#glossary-select").hide('slide', { direction: 'up' }, 350);
				$("#glossary-select-middle").css('margin','1px');
			}
		}

		if ( ($(e.target).closest('#help-window').length == 0) && ($(e.target).closest('#help-button').length == 0) ) {
			if (isHelpOpen==true)
			{
				isHelpOpen = false;
				$("#help-button").addClass("help-button-style").removeClass("help-button-style-active");
				$("#help-window").hide('slide', { direction: 'up' }, 350);
				$("#wrap").css('margin','1px');
			}
		}

	});


	//check if volume should be disabled
	//initVolumeBox()
	setTimeout("initVolumeBox()", 1000);


	$("#progress-bar").bind('mouseover', function() { clearTimeout(ProgressTimer); ProgressShowTimer = setTimeout('ShowProgress()',200); }  );
	$("#progress-bar").bind('mouseout',function() { clearTimeout(ProgressShowTimer); ProgressTimer = setTimeout('HideProgress()',800); });

	$("#mode-button").bind('click', toggleModeBox );

	$(document).mousedown(function() { isDown = true; });
	$(document).mouseup(function() { isDown = false; });

	$("#forward-button").bind('click',function() { ForwardClick(); });
	$("#backward-button").bind('click',function() { BackwardsClick(); });

	$("#exit-button").bind('click',function() { ExitClick(); });

	$("#replay-button").bind('click',function() { ReplayClick(); });

	$("#page-combo").bind('click',function() { ChapterComboClick(); });

	$("#glossary-button").bind('click',function() { $("#glossary-select-middle").css('margin','2px'); GlossaryClick(); });


	$("#help-button").bind('click',function() { $("#wrap").css('margin','2px'); HelpClick(); });


	$("#play-button").bind('click',function() {
		if (QuizMode) { return false; }

		if ( $("#play-button").hasClass("play-button-disabled-style") ) { return false; }

		if (isPlay==0) {
			isPlay = 1;
			if (isiPadFirstTimeLoad)
			{
				isiPadFirstTimeLoad = false;
	            $("#play-button").css("opacity", "1");
				window.clearInterval(PlayButtonBlinkTimer);

				//play only jplayer_1 as background audio will not work on tablet as it wont play two streams simultanously
				$("#jquery_jplayer_1").jPlayer("play");
			}

			if ((QuizMode) || (SlideMode) || (PolicyMode) || (FlatQuizMode) || (PopupMode) || (FinalExamMode) || (PreExamMode) || (SurveyMode) || (FlashMode)) {
				$("#jquery_jplayer_1").jPlayer("play");
				$("#Background_Audio_Player").jPlayer("play");


				if (FlashMode) {
					if ($("#jplayer_video").is(":visible")) { $("#jplayer_video").jPlayer("play" ); }

					if ( (FlashXMLCodePause) ||  //if flash paused using xml operation pause then ignore the button
					     (FlashFinished) ) { /* do nothing */ } else //if flash is finished then ignore the button
					{
						if (tid==null) { tid = setInterval(FlashFrame, 100); }
					}
				}
			} else
			{
				$("#jplayer_video").jPlayer("play" );
			}

			$("#play-button").removeClass("play-button-style").addClass("pause-button-style");
			$("#play-button").attr('alt',admin_Pause);	$("#play-button").attr('title',admin_Pause);

		} else
		{
			isPlay = 0;
			if ((QuizMode) || (SlideMode) || (PolicyMode) || (FlatQuizMode) || (PopupMode) || (FinalExamMode) || (PreExamMode) || (SurveyMode) || (FlashMode)) {
				$("#jquery_jplayer_1").jPlayer("pause");
				$("#Background_Audio_Player").jPlayer("pause");

				if (FlashMode) {
					if ($("#jplayer_video").is(":visible")) { $("#jplayer_video").jPlayer("pause" ); }
					if ( (FlashXMLCodePause) ||  //if flash paused using xml operation pause then ignore the button
					     (FlashFinished) ) { /* do nothing */ } else //if flash is finished then ignore the button
					{
						BreakSequenceLoop = true;
						FlashAbortTimer();
					}
				}

			} else
			{
				$("#jplayer_video").jPlayer("pause" );
			}
			$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
			$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
		}
	});


	$(document).keyup(function(e) {
		if (e.keyCode == 27)
		{
			if (isPageComboOpen==true) {
				isPageComboOpen = false;
				$("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
				$("#page-select").hide('slide', { direction: 'up' }, 350);
				$("#page-select-text").css('margin-bottom','1px');
			}

			if (isModeVisible==true)
			{
				toggleModeBox();
			}

			if (isGlossaryOpen==true)
			{
				isGlossaryOpen = false;
				$("#glossary-button").addClass("glossary-button-style").removeClass("glossary-button-style-active");
				$("#glossary-select").hide('slide', { direction: 'up' }, 350);
				$("#glossary-select-middle").css('margin','1px');
			}

			if (isHelpOpen==true)
			{
				isHelpOpen = false;
				$("#help-button").addClass("help-button-style").removeClass("help-button-style-active");
				$("#help-window").hide('slide', { direction: 'up' }, 350);
				$("#wrap").css('margin','1px');

			}
		}
	});

	$("#jplayer_video").bind('contextmenu', function() { return false; });
	$("#template-place").bind('contextmenu', function() { return false; });


	/*
	 * MSIE Fix for hover over video to display progressbar
	 */
	$("#jplayer_video").bind('mouseover', function(e) {

		//TemplateVideoHeight[CurrentTemplateID]
		var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
		//console.log(x+" "+y);
		if ( ( TemplateArrayHasVideo[ CurrentTemplateID ] ) && (parseInt(TemplateVideoHeight[CurrentTemplateID])>0) )
		{
			MouseOnVideo = true; clearTimeout(VideoProgressTimer); VideoProgressShowTimer = setTimeout('ShowVideoProgress()',200);
		}
	});

	$("#jplayer_video").bind('mouseout',function() {
		if ( ( TemplateArrayHasVideo[ CurrentTemplateID ] ) && (parseInt(TemplateVideoHeight[CurrentTemplateID])>0) )
		{
			MouseOnVideo = false; clearTimeout(VideoProgressShowTimer); VideoProgressTimer = setTimeout('HideVideoProgress()',800);
		}
	});

	/*
	 * Show video progress bar on hover over template-space, does not work on MSIE so above code is required
	 */
	$("#template-place").bind('mouseover', function(e) {

		//TemplateVideoHeight[CurrentTemplateID]
		var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
		//console.log(x+" "+y);
		if ( ( TemplateArrayHasVideo[ CurrentTemplateID ] ) && (parseInt(TemplateVideoHeight[CurrentTemplateID])>0) )
		{
			MouseOnVideo = true; clearTimeout(VideoProgressTimer); VideoProgressShowTimer = setTimeout('ShowVideoProgress()',200);
		}
	});

	$("#template-place").bind('mouseout',function() {
		if ( ( TemplateArrayHasVideo[ CurrentTemplateID ] ) && (parseInt(TemplateVideoHeight[CurrentTemplateID])>0) )
		{
			MouseOnVideo = false; clearTimeout(VideoProgressShowTimer); VideoProgressTimer = setTimeout('HideVideoProgress()',800);
		}
	});


	/*
	 * grab space and make it behave like a click for text mode
	 */
	$("body").off("keypress").on("keypress", function(e) {
		if (e.which == 32) {
			$(this).trigger("click");
			//e.preventDefault();
		}

	});

	$("#Background_Audio_Player").bind($.jPlayer.event.ended,
		function(event) {
// -- in older version background audio repeat in Flash mode was decided to be stopped then later it was decided to make it repeat again			
//			if (FlashMode) { } else 
			{
				$("#Background_Audio_Player").jPlayer("play", 0); //loop background audio
			}
	});

	$("#jquery_jplayer_1").bind($.jPlayer.event.paused,  function(event) {
		isPlay = 0;
		$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
		$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);
	});

	$("#jquery_jplayer_1").bind($.jPlayer.event.ended,
		function(event) {
			isPlay = 0;
			$(this).jPlayer("pause" );

			if ((QuizMode) || (SlideMode) || (PolicyMode) || (FlatQuizMode) || (PopupMode) || (FinalExamMode) || (FinalExamMode) || (FlashMode)) {
				$(this).jPlayer( "clearMedia" );
			}


			if (FlashMode) { 
				if (FlashModeAudioEndBlink)
				{
					$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");

					if (selectedPageID<MaxModulePage)
					{
						ModulePageViewableArray[selectedPageID+1] = 1;
						$("#C"+(selectedPageID+1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

						if (ModulePageArray[selectedPageID+1].charAt(0)=="M") //if next row is module then activate the one bellow too
						{
							ModulePageViewableArray[selectedPageID+2] = 1;
							$("#C"+(selectedPageID+2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
						}
					}
					if ( (FlashModeAudioEndNext) && ((admin_AutoForwardDefaultSetting) || (admin_ReviewMode)) )
					{
						//dont blink as it will go to next in the next if
					} else
					{
						if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
					}
					FlashAbortTimer();
					FlashTime=-1;
				}
				
				if (FlashModeAudioEndNext)
				{
					FlashAbortTimer();
					FlashTime=-1;

					if ((admin_AutoForwardDefaultSetting) || (admin_ReviewMode))
					{
						FlashMoveNext(true);
					} else
					{
						FlashMoveNext(false);
					}
				}
				return false; 
			}

			$("#play-button").addClass("play-button-style").removeClass("pause-button-style");
			$("#play-button").attr('alt',admin_Play);	$("#play-button").attr('title',admin_Play);

			if (SlideMode)
			{
				if ((admin_AutoForwardDefaultSetting==true) && (selectedPageID<MaxModulePage))
				{
					ForwardClick();
				} else
				{
					if (selectedPageID<MaxModulePage) {	FwdBlink(4000,1000); }
				}
			}

		}
	);


//	select is disabled from CSS FILE
	document.onselectstart = function() {
//		return false;
	} // ie
	
	document.onmousedown = function(e) {
//		e = e || window.event;
//		var elementId = e.target ? e.target.id : e.srcElement.id;
//		if (elementId!="SurveyMemo") { return false; }
	} // mozilla

	$.doTimeout( '', 1000, function(){	ScormTime()  });
});

//------------------------------------------------------------------------------------------------------------------
$(window).resize(function(){
  $.doTimeout( 'resize', 150, function(){
	resizeControls()
  });
});