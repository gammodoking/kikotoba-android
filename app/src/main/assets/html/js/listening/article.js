$(function() {
    var Sentence = window.sri.Sentence;
    var Article = function($container) {
        var _this = this;
        this.$container = $container;
        this.$popup = $('#popup');
        this.$popupContents = $('#popupContents');
        this.$popupCloseButton = $('#popupCloseButton');
        this.$popupCloseButton.on('click touchend', function() {
            _this.popup();
        });

        this.isBlindMode = false;

        this.$sentenceArray = [];

        // 文をバッファにつめて段落ごとに吐き出す
        this.$sentenceBuffer = [];
        this.currentSentenceIndex = 0;
        this.onSentenceSelectedListener = function() {};
        this.$container.on('click', '.' + Article.CLASS_SENTENCE, function() {
//        this.$container.on('touchend', '.' + Article.CLASS_SENTENCE, function() {
            _this.currentSentenceIndex = _this._getSentenceIndex(this);
            _this._refreshUI();
            _this.onSentenceSelectedListener(_this.currentSentenceIndex);
        });
    }
    Article.CLASS_SENTENCE = 'script';
    Article.CLASS_TRANSLATION_UNIT = 'translationUnit';
    Article.CLASS_PARAGRAPH = 'paragraph';
    Article.CLASS_CURRENT_PLAYING = 'current-playing';
    Article.CLASS_BLIND = 'blind';

    /**
     * @param {string} articleId
     * @param {int} trackIndex
     */
    Article.prototype.addSentence_ = function addSentence_(sentence, trackIndex) {
        var $sentence = $('<span class="' + Article.CLASS_SENTENCE + '" data-track="%d"></span>')
        $sentence.text(sentence + ' ')
            .data('track', trackIndex);
        this.$sentenceBuffer.push($sentence);
    };

    /**
     * @param {string} sentence
     * @param {number} fromSec
     * @param {number} toSec
     * @param {number} translationIndex
     */
    Article.prototype.addSentence = function addSentence(sentence, fromSec, toSec, translationIndex) {
        var sentence = new window.sri.Sentence(sentence, fromSec, toSec, translationIndex);
        this.$sentenceBuffer.push(sentence.createElement());
        return;

        var $sentence = $('<span class="' + Article.CLASS_SENTENCE + '"'
                + ' data-from-sec="' + fromSec + '"'
                + ' data-to-sec="' + toSec + '"'
                + '></span>'
                )
        $sentence.text(sentence + ' ');
//            .data('track', trackIndex);
        this.$sentenceBuffer.push($sentence);
    };

    Article.prototype.flushParagraph = function flushParagraph() {
        var $paragraph = $('<p class="' + Article.CLASS_PARAGRAPH + '"></p>');
        for (var i = 0; i < this.$sentenceBuffer.length; i++) {
            $paragraph.append(this.$sentenceBuffer[i]);
            this.$sentenceArray.push(this.$sentenceBuffer[i]);
        }
        this.$container.append($paragraph);
        this.$sentenceBuffer = [];
    };

    Article.prototype.setCurrentSentenceIndex = function setCurrentSentenceIndex(currentSentenceIndex) {
        this.currentSentenceIndex = currentSentenceIndex;
        this._refreshUI();
    };

    /**
     * @param {function} listener(int selectedIndex)
     */
    Article.prototype.setOnSentenceSelectedListener = function setOnSentenceSelectedListener(listener) {
        this.onSentenceSelectedListener = listener;
    }

    /**
     * 現在の文までスクロール
     */
    Article.prototype.scrollUpToSentence = function scrollUpToSentence() {
        var top = this.$container.find('.' + Article.CLASS_CURRENT_PLAYING).offset().top - 20;
        $('html,body').animate({scrollTop:top}, 'fast');
    }

    Article.prototype.popup = function popup(text) {
        if (!text) {
            this.$popup.hide();
            return;
        }
        var $current = this._getCurrentSentence();
        if (!$current.length) {
            return;
        }
        this.$popupContents.text(text);

        // 翻訳の
        var $translationUnits = this.$container.find('.' + Article.CLASS_TRANSLATION_UNIT);
        var $lastTranslationUnit = $translationUnits.eq($translationUnits.length - 1);

        var position = $lastTranslationUnit.height() + $lastTranslationUnit.offset().top + 20;
        this.$popup
                .css('top', position)
                .show();
    }

    Article.prototype._getCurrentSentence = function _getCurrentSentence() {
        $s = this.$container.find('.' + Article.CLASS_CURRENT_PLAYING)
        if ($s.length > 0) {
            return $s;
        }

        $s = this.$container.find('.' + Article.CLASS_SENTENCE).eq(0);
        if ($s.length > 0) {
            return $s;
        }

        throw new Error('currentの文章が見つかりません');
    }
//    Article.prototype.next = function next() {
//        if (this.currentSentenceIndex < this.$sentenceArray.length - 1) {
//            this.currentSentenceIndex += 1;
//        }
//        this._refreshUI();
//    };
//
//    Article.prototype.prev = function prev() {
//        if (this.currentSentenceIndex > 0) {
//            this.currentSentenceIndex -= 1;
//        }
//        this._refreshUI();
//    };

    /**
     * @param {DomElement} sentenceDom
     * @return {Number} sentenceDomが全体の何番目か
     */
    Article.prototype._getSentenceIndex = function _getSentenceIndex(sentenceDom) {
        var sentenceIndex = -1;
        for (var i = 0; i < this.$sentenceArray.length; i++) {
            if (this.$sentenceArray[i].get(0) === sentenceDom) {
                sentenceIndex = i;
                break;
            }
        }
        if (sentenceIndex < 0) {
            throw new Error('文が見つかりませんでした。#' + $(sentenceDom).html() + "#");
        }
        return sentenceIndex;
    }

    /**
     * UIを更新する
     */
    Article.prototype.refreshUI = function refreshUI() {
        this._refreshUI();
    }

    Article.prototype._refreshUI = function _refreshUI() {
        // 読み上げ中
        this.$container.find('.' + Article.CLASS_SENTENCE)
                .removeClass(Article.CLASS_CURRENT_PLAYING);
        if (this.$sentenceArray[this.currentSentenceIndex]) {
            this.$sentenceArray[this.currentSentenceIndex].addClass(Article.CLASS_CURRENT_PLAYING);
        }

        // ポップアップ隠す
        this.$popup.hide();

        // 目隠し
        this.$container
                .find('.' + Article.CLASS_BLIND)
                .removeClass(Article.CLASS_BLIND);
        if (this.isBlindMode && this.$sentenceArray[this.currentSentenceIndex]) {
            this.$sentenceArray[this.currentSentenceIndex].addClass(Article.CLASS_BLIND);
        }

        // 翻訳
        this.$container
                .find('.' + Article.CLASS_TRANSLATION_UNIT)
                .removeClass(Article.CLASS_TRANSLATION_UNIT);
        var translationIndex = this.$sentenceArray[this.currentSentenceIndex].data('translation-index');
        $('[data-translation-index=' + translationIndex + ']').addClass(Article.CLASS_TRANSLATION_UNIT);
    }

    /**
     * @return Sentence
     */
    Article.prototype.getCurrentSentence = function getCurrentSentence() {
        return Sentence.newInstance(this._getCurrentSentence());
    }

    window.sri = window.sri || {};
    window.sri.Article = Article;
});
