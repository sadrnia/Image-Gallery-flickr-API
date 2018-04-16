/*
Image.js  defines a Gallery object exposed in the global scope, contains two parameters:
 - list of the photos belonging to the gallery
 - DOM element that shows the images in natural size.*/

(function (document, window) {
    'use strict';

    function Gallery(container, imageContainer) {
        this.currentIndex = 0;
        this.photos = [];
        this.container = container;
        this.imageContainer = imageContainer;
        this.bIsLargeImageVisible = false;
        this.bPreviousLoading = false;
    }

    Gallery.prototype.setData = function (photos) {        
        this.photos = photos;
        this.currentIndex = this.bPreviousLoading ? (this.photos.length - 1) : 0;
        this.bPreviousLoading = false;
        if (this.bIsLargeImageVisible) {
            this.showPhoto(this.currentIndex);
        }
        
    };

    Gallery.prototype.showPhoto = function (index) {
        if (index >= 0 && index < this.photos.length) {
            var self = this;
            this.currentIndex = index;
            $("#img_close_popup").on("click", function () {
                $(self.container).removeClass("display_block");
                $(document.body).removeClass("overflow_hidden");
                self.bIsLargeImageVisible = false;
            });
            $(document.body).addClass("overflow_hidden");
            $(this.container).addClass("display_block");
            this.imageContainer.src = "css/res/loader.gif";
            this.imageContainer.src = Flickr.buildPhotoLargeUrl(this.photos[this.currentIndex]);
            $(self.container).find(".img_name").text(self.photos[self.currentIndex].title);
            this.bIsLargeImageVisible = true;
        }
    };

    Gallery.prototype.showPrevious = function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showPhoto(this.currentIndex);
            return true;
        }
        this.bPreviousLoading = true;
        return false;
    };

    Gallery.prototype.showNext = function () {
        if (this.currentIndex < this.photos.length - 1) {
            this.currentIndex++;
            this.showPhoto(this.currentIndex);
            return true;
        }
        this.bPreviousLoading = false;
        return false;        
    };

    Gallery.prototype.createThumbnailsGallery = function (container) {
        function clickHandler(index, gallery) {
            return function (event) {
                event.preventDefault();
                gallery.showPhoto(index);
            };
        }

        container.innerHTML = '';
        //noinspection JSUnresolvedFunction
        $(container).masonry('layout');
        var image, link, listItem, details, photo, details_container;
        for (var i = 0; i < this.photos.length; i++) {

            photo = this.photos[i];
            image = document.createElement('img');
            image.src = Flickr.buildThumbnailUrl(this.photos[i]);
            image.className = 'thumbnail';
            image.alt = photo.title;
            image.title = photo.title;

            link = document.createElement('a');
            link.href = image.src;
            link.addEventListener('click', clickHandler(i, this));
            link.appendChild(image);

            details_container = document.createElement('div');
            details_container.className = 'image_details_container';

            details = document.createElement('div');
            details.innerHTML = "<span class='img_detail_span'>" + photo.title + "</span>";
            details.className = 'image_details';

            details_container.appendChild(details);
            link.appendChild(details_container);

            listItem = document.createElement('div');
            listItem.className = "box";
            listItem.appendChild(link);

            //noinspection JSUnresolvedFunction
            $(container).append($(listItem)).masonry('appended', $(listItem));
        }
    };

    window.Gallery = Gallery;
})(document, window);