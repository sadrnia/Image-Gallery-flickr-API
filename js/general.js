/**
 * general.js defines the event handlers for the buttons of the gallery, what to do when the user searches for some given text
 and what happens when a user clicks one of the links in the pager.
 */
(function (document, window) {
    'use strict';

    var gallery;
    var lastSearch = 'Spring';
    var currentPage = 1;
    var totalPages = 0;
    var timeoutID = null;
    var masonarycontainer;
    var elmQuery, elmLargePhotoContainer, elmThumbNailContainer, elmEnlargePhoto,
        elmPaginator;


    function searchPhotos(text, page) {
        if (text.length === 0) {
            return;
        }
        lastSearch = text;
        page = page > 0 ? page : 1;

        Flickr.searchText({
            text: text,
            per_page: 60,
            jsoncallback: 'App.showPhotos',
            page: page
        });
    }

    function updatePager(element, parameters) {

        var bDisplay = false;
        var strNext = '', strPrevious = '';
        var nextElm = element.find(".next_link");
        var preElm = element.find(".previous_link");

        if (parameters.pagesNumber > 0) {
            bDisplay = true;
            $(".page_count").text(parameters.currentPage + " of " + parameters.pagesNumber);

            if (parameters.currentPage === parameters.pagesNumber) {
                nextElm.addClass("navigator_link_disable");
                if (parameters.pagesNumber > 1) {
                    preElm.removeClass("navigator_link_disable");
                }
            } else if (parameters.currentPage === 1) {
                if (parameters.pagesNumber > 1) {
                    nextElm.removeClass("navigator_link_disable");
                }
                preElm.addClass("navigator_link_disable");
            }
            else {
                preElm.removeClass("navigator_link_disable");
                nextElm.removeClass("navigator_link_disable");
            }
        }
        else {
            nextElm.addClass("navigator_link_disable");
            preElm.addClass("navigator_link_disable");
            $(".page_count").text("No Result Found");
            //element.css("display", (bDisplay ? "block" : "none"));
        }

    }

    function showPhotos(data) {

        if (data.stat !== "ok") {
            return;
        }

        totalPages = data.photos.pages;
        updatePager(
           elmPaginator, {
               query: lastSearch,
               currentPage: data.photos.page,
               pagesNumber: data.photos.pages
           }
        );

        $("#notes").html("Search result for : <b>" + lastSearch + "</b>");
        gallery.setData(data.photos.photo);
        gallery.createThumbnailsGallery(elmThumbNailContainer[0]);
    }

    function init() {

        elmQuery = $('#query');
        elmLargePhotoContainer = $('.enlarge_photo_galary');
        elmThumbNailContainer = $('#thumbnails_list');
        elmEnlargePhoto = elmLargePhotoContainer.find('#enlarge_photo_image')[0];
        elmPaginator = $('.thumbnails_pager');

        masonarycontainer = elmThumbNailContainer.masonry({
            "columnWidth": 150,
            "itemSelector": ".box",
            "gutter": 7
        });

        gallery = new Gallery(elmLargePhotoContainer[0], elmEnlargePhoto);

        bindEvents();

        searchPhotos(lastSearch, currentPage);
    }

    function LoadLargeImage(bNext) {
        if (bNext) {
            if (!gallery.showNext.bind(gallery)() && (currentPage + 1) < totalPages) {
                currentPage++;
                searchPhotos(lastSearch, currentPage);
            }
        } else {
            if (!gallery.showPrevious.bind(gallery)() && (currentPage - 1) >= 1) {
                currentPage--;
                searchPhotos(lastSearch, currentPage);
            }
        }
    }


    function bindEvents() {
        $('#form_search').on('submit', function (event) {
            event.preventDefault();
            var val = elmQuery.val();
            if (val.length > 0) {
                searchPhotos(val, 1);
            }
        });

        $('.navigator_link').on('click', function (event) {
            event.preventDefault();
            var data_id = $(event.target).attr("data-id");
            if (data_id === "next") {
                currentPage++;
            } else {
                currentPage--;
            }

            searchPhotos(lastSearch, currentPage);
        });

        $('.gallery_arrow').on('click', function (event) {
            event.preventDefault();
            var data_id = $(event.target).attr("data-id");
            LoadLargeImage(data_id === "next");
        });

        $('.gallery_arrow').on('keydown', function () {
            event.preventDefault();
            if (event.which === 13) {
                var data_id = $(event.target).attr("data-id");
                LoadLargeImage(data_id === "next");
            }
        });

        elmQuery.on("keyup", function () {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(function () {
                var search = elmQuery.val();
                if (search && search.trim().length > 1 && search !== lastSearch) {
                    console.log("Serching For : " + elmQuery.val());
                    searchPhotos(elmQuery.val(), 1);
                }
            }, 300);
        });
    }

    window.App = Utility.extend(window.App || {}, {
        init: init,
        showPhotos: showPhotos
    });

})(document, window);

$(document).ready(function () {
    App.init();
});
