// Foundation.addToJquery($);
import $ from "jquery";
import Foundation from "foundation-sites";
/**
 * Descrip:    Site wide script calls
 */
jQuery(document).ready(function ($) {
  /**
   * Select payment method on load
   */

  const paymentMethods = Array.from(
    document.querySelectorAll(".wc_payment_methods li")
  );
  let bascStatus = false;
  if (paymentMethods) {
    paymentMethods.map((method) => {
      if (method.classList.contains("payment_method_bacs")) {
        method.querySelector("input").click();
        bascStatus = true;
      }
      if (method.classList.contains("payment_method_stripe") && !bascStatus) {
        method.querySelector("input").click();
      }
    });
  }

  /**
   * Checkout phone numbers
   */

  const resetIntlTelInput = (input) => {
    input.classList.remove("error-input");

    if (
      input.parentNode.parentNode.parentNode.querySelector(".input-tel-error")
    ) {
      input.parentNode.parentNode.parentNode
        .querySelector(".input-tel-error")
        .remove();
    }
  };

  const InvalidNumberHtml = `
    <strong>Invalid number! Acceptable formats are:</strong>
    <ul>
      <li>Mobile: 0453 333 333</li>
      <li>Landline: 02 0900 1233</li>
      <li>Toll free: 1300 123 123 or 1800 123 123</li>
    </ul>
  `;
  // here, the index maps to the error code returned from getValidationError - see readme
  const errorMap = [
    InvalidNumberHtml,
    InvalidNumberHtml,
    "Too short",
    "Too long",
    InvalidNumberHtml,
    InvalidNumberHtml,
  ];
  const errorMapNoneAu = [
    "Invalid number",
    "Invalid country code",
    "Too short",
    "Too long",
    "Invalid number",
  ];

  let telInputs = [];

  const shippingOfficePhoneNumber = document.querySelector(
    "#shipping_office_phone_number"
  );
  const billingNumber = document.querySelector("#billing_phone");
  const contactFormPhoneNumbers = Array.from(
    document.querySelectorAll(`[name="your-number"]`)
  );

  if (contactFormPhoneNumbers) {
    contactFormPhoneNumbers.map((numberInput) => {
      telInputs.push(numberInput);
    });
  }

  if (billingNumber) {
    telInputs.push(billingNumber);
  }

  if (shippingOfficePhoneNumber) {
    telInputs.push(shippingOfficePhoneNumber);
  }

  if (telInputs) {
    telInputs.map((intlInput) => {
      const iti = window.intlTelInput(intlInput, {
        initialCountry: "AU",
        formatOnDisplay: false,
        separateDialCode: true,
        utilsScript: `${window.ajax_object.root_folder}/node_modules/intl-tel-input/build/js/utils.js`,
      });

      setupTelNumberInput(intlInput, iti);
    });
  }

  function setupTelNumberInput(input, iti) {
    input.addEventListener("blur", () => {
      resetIntlTelInput(input);

      if (input.value.trim()) {
        const countryData = iti.getSelectedCountryData();

        if (iti.isValidNumber()) {
          // remove error
          input.parentNode.parentNode.parentNode
            .querySelector(".input-tel-error")
            ?.remove();
          input.classList.contains("error-input")
            ? input.classList.remove("error-input")
            : null;

          if (countryData && countryData.dialCode === "61") {
            let number = input.value.trim();

            // remove country code from the input if it was added
            if (number.substr(0, 3).includes("61")) {
              // clear input
              let cleanNumber = number.replace("61", "").replace("+", "");
              iti.setNumber(cleanNumber);
              number = cleanNumber;
            }

            // check if mobile has first as 0 and if not then update it
            if (parseInt(number.charAt(0)) !== 0) {
              iti.setNumber(`0${number}`);
              // check if billing number is on the page an update its value
              if (document.getElementById("billing_phone")) {
                document.getElementById("billing_phone").value = `0${number}`;
              }
            }
          }
        } else {
          !input.classList.contains("error-input")
            ? input.classList.add("error-input")
            : null;
          const errorCode = iti.getValidationError();

          if (
            !input.parentNode.parentNode.parentNode.querySelector(
              ".input-tel-error"
            )
          ) {
            let newErrorDiv = document.createElement("div");
            newErrorDiv.classList.add("input-tel-error");

            if (countryData && countryData.dialCode !== "61") {
              newErrorDiv.innerHTML =
                errorMapNoneAu[errorCode === -99 ? 0 : errorCode];
            } else {
              newErrorDiv.innerHTML =
                errorMap[errorCode === -99 ? 0 : errorCode];
            }

            input.parentNode.parentNode.parentNode.insertBefore(
              newErrorDiv,
              input.nextSibling
            );
          } else {
            input.parentNode.parentNode.parentNode.querySelector(
              ".input-tel-error"
            ).innerHTML = errorMap[errorCode];
          }
        }
      }
    });

    // on keyup / change flag: reset
    input.addEventListener("change", resetIntlTelInput(input));
    input.addEventListener("keyup", resetIntlTelInput(input));
  }

  //aos
  AOS.init();

  //foundation\
  
  $(document).foundation();

  $(window).resize(function () {
    var width = $(window).width();
    if (width > 992) {
      //toggle mobile nav to hide
      //check if mobile nav is active and if yes toggle it
      if ($("body").hasClass("noscroll")) {
        //animation out
        var $animation = $("#mobile-navigation").data("animation");
        MotionUI.animateOut($("#mobile-navigation"), $animation);
        $(".navigation .hamburger").removesClass("is-active");
        if ($("body").hasClass("noscroll")) {
          $("body").removeClass("noscroll");
        }
      }
    }
    if (width < 640) {
      mobileTopHeaderCarousel();
    }
  });

  /**
   * Mobile Header
   */
  mobileTopHeaderCarousel();

  function mobileTopHeaderCarousel() {
    const mobileHeaderCarousel = document.getElementById(
      "top-header-mobile-carousel"
    );
    if (mobileHeaderCarousel && window.outerWidth < 640) {
      $("#top-header-mobile-carousel .inner-carousel").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        draggable: true,
        touchMove: true,
        arrows: true,
        fade: true,
        // autoplay: 0,
        // loop: 1,
      });
    }
  }

  if ($(".flexible-delivery-locations-carousel").length > 0) {
    //tetimonial carousel
    $(".flexible-delivery-locations-carousel .slick-slider").slick({
      slidesToShow: 7,
      slidesToScroll: 1,
      autoplay: true,
      draggable: true,
      autoplaySpeed: 4000,
      touchMove: true,
      arrows: true,
      autoplay: 1,
      loop: 1,
      responsive: [
        {
          breakpoint: 1500,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: 6,
          },
        },
        {
          breakpoint: 1400,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: 5,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 640,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: 2,
          },
        },
      ],
    });
  }

  /*
   *
   * Header Phone Icon
   *
   */
  $(".call-us a").on("click", function (e) {
    if ($(window).width() > 1024) {
      if (!$(this).hasClass("shown")) {
        e.preventDefault();
        $(this).addClass("shown");
      }
    }
  });

  /*
   *
   * Smooth Scroll on page load from URL
   *
   */
  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 1);
  $(window).on("load", function () {
    var urlHash = window.location.href.split("#")[1];
    if (urlHash && $("#" + urlHash).length) {
      $("html,body").animate(
        {
          scrollTop: $("#" + urlHash).offset().top - 100,
        },
        1000
      );
    }
  });

  /*
   *
   * Notification bar
   *
   */
  const notificationBar = $(".notification-bar");
  //close bar button
  $(notificationBar)
    .find(".close-bar")
    .on("click", function (e) {
      e.preventDefault();
      fw_notification_bar(); //close bar
      notificationBar.fadeOut();
      $("body").removeClass("notification-bar-on");
    });
  //cta button
  $(notificationBar)
    .find(".btn")
    .on("click", function () {
      fw_notification_bar();
    });
  //add body class if bar is visible
  if ($(notificationBar).is(":visible")) {
    $("body").addClass("notification-bar-on");
  }
  function fw_notification_bar() {
    //check if cookie was setup and if not add it
    if ($.cookie("fw_notification_bar")) {
    } else {
      $.cookie("fw_notification_bar", "1", { expires: 1, path: "/" });
    }
  }

  /*
   *
   * Food Menu Effect on Scroll Up and Down
   *
   */
  if ($("#food-menu").length > 0) {
    var prevScrollpos = window.pageYOffset;
    var $menu_height = $("#food-menu").outerHeight();
    $(window).resize(function () {
      $menu_height = $("#food-menu").outerHeight();
    });
    window.onscroll = function () {
      var currentScrollPos = window.pageYOffset;
      var shopMobileControls = $("#shop-mobile-controls");

      if (prevScrollpos > currentScrollPos) {
        document.getElementById("food-menu").style.marginTop = "0";
      } else {
        document.getElementById("food-menu").style.marginTop =
          "-" + $menu_height + "px";
      }
      prevScrollpos = currentScrollPos;
    };
  }

  /*
   *
   * Cart Widget Adjust on load and resize
   *
   */
  adjust_cart_widget_vertical_position();
  $(window).resize(function () {
    adjust_cart_widget_vertical_position();
  });
  $(window).scroll(function () {
    adjust_cart_widget_vertical_position();
  });

  //prevent scroll to section for cart page when product is removed
  $(document).ajaxComplete(function () {
    if (
      $("body").hasClass("woocommerce-checkout") ||
      $("body").hasClass("woocommerce-cart")
    ) {
      $("html, body").stop();
    }
  });

  //mailchimp ajax sign up
  $(".subscribe-form button.submit").on("click", function (e) {
    e.preventDefault();
    //get the form
    var $form = $(".subscribe-form form"),
      submitButton = $(this),
      loader =
        '<div class="loader"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
      responseDivSuccess = $("#mce-responses #mce-success-response"),
      responseDivError = $("#mce-responses #mce-error-response");

    //clear error div
    responseDivError.html("");

    var error_free = true;

    //check if fields are populated
    if ($($form).find("input.email").val() == "") {
      error_free = false;
      responseDivError.html("Email address is required.");
      responseDivError.show();
    }

    if ($($form).find("input.phone").val() == "") {
      error_free = false;
      responseDivError.html("Phone is required.");
      responseDivError.show();
    }

    if ($($form).find("input.fname").val() == "") {
      error_free = false;
      responseDivError.html("Name is required.");
      responseDivError.show();
    }

    if (error_free == true) {
      submitButton.html(loader);
      submitButton.prop("disabled", true);
      $.ajax({
        url: ajax_object.ajax_url,
        data: {
          action: "regular_mailchimp_signup",
          email: $($form).find("input.email").val(),
          phone: $($form).find("input.phone").val(),
          name: $($form).find("input.fname").val(),
        },
        cache: false,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
          $form.find("ul").hide();

          if (data.status == 200) {
            //show success message
            responseDivSuccess.html("Thank you for subscribing.");
            responseDivSuccess.show();
          } else {
            //show success message
            responseDivSuccess.html(
              "Sorry, something went wrong." + "Error code: " + data.status
            );
            responseDivSuccess.show();
          }
          submitButton.html("Submit");
          submitButton.prop("disabled", false);
        },
        error: function (error) {
          // console.log(JSON.stringify(error)); //for testing
          responseDivError.html(error.status);
          responseDivError.show();
          submitButton.html("Submit");
          submitButton.prop("disabled", false);
        },
      });
    }
  });

  //reset to 0 on initial load
  $(".cross-sells input.qty").each(function () {
    $(this).val(0);
  });

  /*
   *
   * Cross Sale Listener
   * Clear Error if option was selected
   *
   */
  $(".cross-sells .variations select").on("change", function () {
    $(this).parent().find(".select-option-error").remove();
  });

  //add to cart for extras on Cart page
  $(".cross-sells .single_add_to_cart_button").on("click", function (e) {
    e.preventDefault();

    //check if there is an options available
    if ($(this).val() == "") {
      if (
        $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .find("table.variations select").length > 0
      ) {
        if (
          $(this)
            .parent()
            .parent()
            .parent()
            .parent()
            .find("table.variations select")
            .val() == ""
        ) {
          $(
            '<span class="select-option-error">Please select option</span>'
          ).insertAfter(
            $(this)
              .parent()
              .parent()
              .parent()
              .parent()
              .find("table.variations select")
          );
          return false;
        }
      }
    }

    var add_to_cart_btn = $(this);
    add_to_cart_btn.html("Adding...");

    //get quantity
    var quantity = $(this).parent().find("input.qty").val();
    var varidation_id = $(this).parent().find(".variation_id").val();

    var productId = $(this).val();

    if ($(this).val() == "") {
      productId = $(this).parent().find('input[name="product_id"]').val();
    }

    var products_array = [];
    var $product_type = "";

    if ($(this).val() == "") {
      products_array.push({ variation_id: varidation_id, quantity: quantity });
      $product_type = "variations";
    } else {
      products_array.push({ product_id: productId, quantity: quantity });
      $product_type = "single-item";
    }

    var order_data = {
      product_id: productId,
      product_type: $product_type,
      products: products_array,
    };

    $.ajax({
      url: ajax_object.ajax_url,
      data: {
        action: "real_peas_add_to_cart",
        order_data: order_data,
      },
      success: function (data) {
        $('.woocommerce-cart-form button[name="update_cart"]').prop(
          "disabled",
          false
        );
        timeout = setTimeout(function () {
          $('[name="update_cart"]').trigger("click");
          //update cart address shipping
          $('button[name="calc_shipping"]').trigger("click");
          add_to_cart_btn.html("Add to cart");
        }, 1000);
        add_to_cart_btn.html('Added to Cart <i class="fas fa-check"></i>');
      },
      complete: function (data) {
        $(this).parent().find("input.qty").val(0);
      },
      error: function (errorThrown) {
        add_to_cart_btn.html("Add to cart");
      },
    });

    return false;
  });

  /*
   *
   * Custom Dropdown for the main Menu - Mobile
   *
   */
  $("#mobile-navigation .dropdown > a").on("click", function (e) {
    e.preventDefault();
    if (!$(this).hasClass("active-dropdown")) {
      $(this).addClass("active-dropdown");
    } else {
      $(this).removeClass("active-dropdown");
    }
  });

  //custom login form ajax processing
  $("#user-menu .custom-login-form button#wp-submit").on("click", function (e) {
    var loader = $("#user-menu .loader-wrapper");

    e.preventDefault();
    //get user_name
    var logUser = $(this).parent().parent().find("#user_login").val();
    var logPass = $(this).parent().parent().find("#user_pass").val();
    var nonce = $(this).parent().parent().find(".login-form-security").val();
    var error_free = true;

    //check values
    if (logUser === "") {
      $(this).parent().parent().find("#user_login").addClass("error");
    } else {
      $(this).parent().parent().find("#user_login").removeClass("error");
    }
    if (logPass === "") {
      $(this).parent().parent().find("#user_pass").addClass("error");
    } else {
      $(this).parent().parent().find("#user_pass").removeClass("error");
    }
    if (logUser != "" && logPass != "") {
      error_free = true;
    } else {
      error_free = false;
    }

    if (error_free == true) {
      loader.show();
      $.ajax({
        url: ajax_object.ajax_url,
        dataType: "JSON",
        data: {
          action: "custom_login_form_user_menu",
          user_name: logUser,
          user_password: logPass,
          security: nonce,
        },
        success: function (data) {
          //show next step
          var status = JSON.stringify(data.status);
          if (status == 0) {
            var errors = JSON.stringify(data.errors);
            $(".user-form-errors").html(
              '<div class="error display-block ml-10 mr-10 mb-10">' +
                errors.replace(/\\/g, "") +
                "</div>"
            );
          } else {
            //proceed
            //go and set order parameters
            window.location.replace("/shop/category/office-catering/");
          }
          loader.hide();
        },
        error: function (errorThrown) {
          //output error
          loader.hide();
          // console.log(JSON.stringify(errorThrown));
        },
      });
      return false;
    }
  });

  //apply for a job
  if ($(".apply-for-a-job").length > 0) {
    $(".btn-file-input-cv input").on("change", function () {
      var path = $(this).val();
      var filename = path.replace(/^.*[\\\/]/, "");
      //add file name below the button
      $(".input-cv-upload").html("<strong>Attached:</strong> " + filename);
      $(".input-cv-upload").show();
    });
  }
  //initite stores map
  $(".stores-grid .map").each(function () {
    var map = null;
    // create map - refer to gmap.js file
    map = new_map($(this));
  });

  //simple parallax bottom to top
  var parallaxElements = $(".parallax-image img"),
    parallaxQuantity = parallaxElements.length;

  var scrolledMultiplier = 0.1;

  $(window).resize(function () {
    var width = $(window).width();
    if (width < 640) {
      scrolledMultiplier = 0.3;
    }
  });

  $(window).on("scroll", function () {
    window.requestAnimationFrame(function () {
      for (var i = 0; i < parallaxQuantity; i++) {
        var currentElement = parallaxElements.eq(i);
        var scrolled = $(window).scrollTop();
        var width = $(window).width();
        if (width < 640) {
          scrolledMultiplier = 0.3;
        }
        currentElement.css({
          transform:
            "translate3d(0," + scrolled * -scrolledMultiplier + "px, 0)",
        });
      }
    });
  });

  //privacy BAR smooth processing
  var gdprPrivacyBar = $(".gdpr-privacy-bar");

  $("button.gdpr-agreement").on("click", function (e) {
    e.stopImmediatePropagation();
    //set cookie for a day
    $.cookie("gdpr[privacy_bar]", 1, { expires: 1, path: "/" });
    //hide bar
    gdprPrivacyBar.animate({ bottom: "-100%" }, "slow");
  });

  //open Lightbox
  $(document).on("click", ".bb-lightbox", function (e) {
    e.preventDefault();
    var image = $(this).attr("href");
    $("body").addClass("noscroll");
    $("body").append(
      '<div class="lightbox-opened slow ease" data-animation="fade-in fade-out"><div class="lightbox-img-wrapper"><img src="' +
        image +
        '"></div></div>'
    );
    var $animation = $(".lightbox-opened").data("animation");
    MotionUI.animateIn($(".lightbox-opened"), $animation);
  });

  //close Lightbox
  $(document).on("click", ".lightbox-opened", function () {
    $("body").removeClass("noscroll");
    var $animation = $(".lightbox-opened").data("animation");
    MotionUI.animateOut($(".lightbox-opened"), $animation);
    $(".lightbox-opened").remove();
  });

  //adjust height if images in gallery based a row height
  $(window).resize(function () {
    if (".flexible-image-gallery-grid".length > 0) {
      var width = $(window).width();
      if (width > 768) {
        resize_gallery_images();
      } else if (width < 768) {
        unset_height_gallery_images();
      }
    }
  });

  if ($(".flexible-image-gallery-grid").length > 0) {
    var width = $(window).width();
    if (width > 768) {
      resize_gallery_images();
    } else if (width < 768) {
      unset_height_gallery_images();
    }
  }

  //hamburger toggle
  $(".navigation .hamburger").click(function () {
    if ($(".navigation .hamburger").hasClass("is-active")) {
      //animation out
      var $animation = $("#mobile-navigation").data("animation");
      MotionUI.animateOut($("#mobile-navigation"), $animation);
      $(".navigation .hamburger").removeClass("is-active");
      if ($("body").hasClass("noscroll")) {
        $("body").removeClass("noscroll");
      }
    } else {
      $(".navigation .hamburger").addClass("is-active");
      if ($("#mobile-navigation").hasClass("full-screen-mobile-menu")) {
        $("body").addClass("noscroll");
      }
      //animation in
      var $animation = $("#mobile-navigation").data("animation");
      MotionUI.animateIn($("#mobile-navigation"), $animation);
    }
  });

  //flexslider initiation
  $(".flexslider").flexslider();

  //slick carousel
  $(".slick").slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  });

  if ($(".root-category-testimonials-carousel").length > 0) {
    //tetimonial carousel
    $(".root-category-testimonials-carousel .slick-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      draggable: true,
      autoplaySpeed: 4000,
      touchMove: true,
    });
  }

  if ($(".partnerships-carousel").length > 0) {
    //initite testimonials carousel
    $(".partnerships-carousel").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      draggable: true,
      autoplaySpeed: 4000,
      touchMove: true,
    });
  }

  if ($(".offers-carousel").length > 0) {
    //initite testimonials carousel
    $(".offers-carousel").slick({
      slidesToShow: 3,
      slidesToScroll: 3,
      draggable: true,
      dots: false,
      arrows: true,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  if ($(".testimonials-carousel").length > 0) {
    //initite testimonials carousel
    $(".testimonials-carousel").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      autoplay: true,
      autoplaySpeed: 2000,
    });
  }

  if ($(".flexible-content-carousel").length > 0) {
    //initite images carousel
    $(".content-carousel").slick({
      slidesToShow: slidesToShow,
      slidesToScroll: 1,
      autoplay: true,
      infinite: true,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: 4,
          },
        },
        {
          breakpoint: 640,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: 2,
          },
        },
      ],
    });
  }

  if ($(".flexible-images-carousel").length > 0) {
    const imgCarousel = document.querySelector(
      ".flexible-images-carousel .images-carousel"
    );
    let autoPlay = imgCarousel.getAttribute("data-autoplay");
    let loop = imgCarousel.getAttribute("data-loop-through");
    const desktopQty = imgCarousel.getAttribute("data-desktop");
    const tabletQty = imgCarousel.getAttribute("data-tablet");
    const mobileQty = imgCarousel.getAttribute("data-mobile");

    //check vars
    if (autoPlay == 0) {
      autoPlay = false;
    } else {
      autoPlay = true;
    }
    if (loop == 0) {
      loop = false;
    } else {
      loop = true;
    }

    //initite images carousel
    $(".images-carousel").slick({
      slidesToShow: desktopQty,
      slidesToScroll: 1,
      autoplay: autoPlay,
      infinite: loop,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: tabletQty,
          },
        },
        {
          breakpoint: 640,
          settings: {
            arrows: true,
            centerMode: false,
            slidesToShow: mobileQty,
          },
        },
      ],
    });
  }

  if ($(".related-products-carousel").length > 0) {
    //initite images carousel
    $(".related-products-carousel").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 4000,
      infinite: false,
      lazyLoad: "ondemand",
      responsive: [
        {
          breakpoint: 992,
          settings: {
            centerMode: false,
            slidesToShow: 2.25,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            centerMode: false,
            slidesToShow: 1.25,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  if ($(".product-gallery-carousel").length > 0) {
    $(".product-gallery-carousel").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      pauseOnFocus: true,
      autoplaySpeed: 3000,
      infinite: false,
      arrows: true,
      dots: true,
      adaptiveHeight: false,
      lazyLoad: "ondemand",
    });
  }

  //load more button
  if ($("#load-more-posts").length > 0) {
    var loader = $(".grid-posts-action-control .loader");
    var loadMoreBtn = $("#load-more-posts");

    $(".reset-search").on("click", function (e) {
      e.preventDefault();
      //hide reset button
      $("#blog-search .reset-search").hide();
      //reset field
      $("#blog-search .search-field").val("");
      //load posts
      //reset paged
      loadMoreBtn.val("2");

      $(".grid-posts-row").hide();
      loadMoreBtn.hide();
      loader.show();

      $.ajax({
        url: ajax_object.ajax_url,
        data: {
          action: "initial_load_blog_posts",
          categories: blogs_categories,
          posts_per_page: blogs_posts_per_page,
          grid_layout: blogs_grid_layout,
          paged: loadMoreBtn.val(),
          equal_height: blogs_equal_height,
          search_keyword: $("#blog-search input.search-field").val(),
        },
        success: function (data) {
          //parse json data
          $("#posts-grid-wrapper").html(data);
          $(".grid-posts-row").show();
          loader.hide();
          if (data === "") {
            loadMoreBtn.hide();
            $(".grid-posts-action-control").html(
              '<div class="no-more-to-load"><p>No posts have been found</p></div>'
            );
          } else {
            loadMoreBtn.show();
          }
        },
        complete: function () {
          //initiate equalizer on the added row
          $("#posts-grid-wrapper .grid-posts-row").foundation();
        },
        error: function (errorThrown) {
          //loader.hide();
          loadMoreBtn.show();
        },
      });

      return false;
    });
    $("#load-more-posts").on("click", function (e) {
      e.preventDefault();
      loadMoreBtn.hide();
      loader.show();
      var paged = $(this).val();
      $.ajax({
        url: ajax_object.ajax_url,
        data: {
          action: "load_more_posts",
          categories: blogs_categories,
          posts_per_page: blogs_posts_per_page,
          grid_layout: blogs_grid_layout,
          paged: paged,
          equal_height: blogs_equal_height,
          search_keyword: $("#blog-search input.search-field").val(),
        },
        success: function (data) {
          //parse json data
          $(data).insertAfter($("#posts-grid-wrapper .grid-posts-row").last());
          //update paged value on the button
          paged++;
          $("#load-more-posts").val(paged);
          loader.hide();
          if (data === "") {
            loadMoreBtn.hide();
            $(".grid-posts-action-control").html(
              '<div class="no-more-to-load"><p>No more posts to load</p></div>'
            );
          } else {
            loadMoreBtn.show();
          }
        },
        complete: function () {
          //initiate equalizer on the added row
          $("#posts-grid-wrapper .grid-posts-row").last().foundation();
        },
        error: function (errorThrown) {
          loadMoreBtn.show();
        },
      });

      return false;
    });
  }

  //blog search
  $("#blog-search button").on("click", function () {
    //show reset button
    $("#blog-search .reset-search").show();
    //reset paged
    loadMoreBtn.val("2");

    $(".grid-posts-row").hide();
    loadMoreBtn.hide();
    loader.show();

    $.ajax({
      url: ajax_object.ajax_url,
      data: {
        action: "search_blog_posts",
        categories: blogs_categories,
        posts_per_page: blogs_posts_per_page,
        grid_layout: blogs_grid_layout,
        paged: loadMoreBtn.val(),
        equal_height: blogs_equal_height,
        search_keyword: $("#blog-search input.search-field").val(),
      },
      success: function (data) {
        //parse json data
        $("#posts-grid-wrapper").html(data);
        $(".grid-posts-row").show();
        loader.hide();
        if (data === "") {
          loadMoreBtn.hide();
          $(".grid-posts-action-control").html(
            '<div class="no-more-to-load"><p>No posts have been found</p></div>'
          );
        } else {
          loadMoreBtn.show();
        }
      },
      complete: function () {
        //initiate equalizer on the added row
        $("#posts-grid-wrapper .grid-posts-row").foundation();
      },
      error: function (errorThrown) {
        //loader.hide();
        loadMoreBtn.show();
      },
    });

    return false;
  });

  //load more product button
  if ($("#load-more-products").length > 0) {
    $("#load-more-products").on("click", function (e) {
      var loader = $(".flexible-products-grid .loader");
      var loadMoreBtn = $(".flexible-products-grid #load-more-products");

      e.preventDefault();

      loadMoreBtn.hide();
      loader.show();

      var paged = $(this).val();

      $.ajax({
        url: ajax_object.ajax_url,
        data: {
          action: "load_more_products",
          categories: products_categories,
          posts_per_page: products_posts_per_page,
          grid_layout: products_grid_layout,
          paged: paged,
          equal_height: products_equal_height,
        },
        success: function (data) {
          //parse json data
          $(data).insertAfter(
            $(
              ".flexible-products-grid #products-grid-wrapper .grid-products-row"
            ).last()
          );
          //update paged value on the button
          paged++;

          $("#load-more-products").val(paged);

          loader.hide();

          if (data === "") {
            loadMoreBtn.hide();
            $(".flexible-products-grid .grid-posts-action-control").html(
              '<div class="no-more-to-load"><p>No more products to load</p></div>'
            );
          } else {
            loadMoreBtn.show();
          }
        },
        complete: function () {
          //initiate equalizer on the added row
          $(".flexible-products-grid #products-grid-wrapper .grid-products-row")
            .last()
            .foundation();
        },
        error: function (errorThrown) {
          //loader.hide();
          loadMoreBtn.show();
        },
      });
      return false;
    });
  }

  //load more image button
  if ($("#load-more-images").length > 0) {
    $("#load-more-images").on("click", function (e) {
      var loader = $(".flexible-image-gallery-grid .loader");
      var loadMoreBtn = $(".flexible-image-gallery-grid #load-more-images");

      e.preventDefault();

      loadMoreBtn.hide();
      loader.show();

      var paged = $(this).val();

      $.ajax({
        url: ajax_object.ajax_url,
        data: {
          action: "load_more_images_to_gallery",
          posts_per_page: gallery_posts_per_page,
          grid_layout: gallery_grid_layout,
          paged: paged,
          equal_height: 1,
          page_id: gallery_page_id,
        },
        success: function (data) {
          //parse json data
          $(data).insertAfter(
            $(
              ".flexible-image-gallery-grid  #images-grid-wrapper .grid-image-gallery-row"
            ).last()
          );
          //update paged value on the button
          paged++;

          $("#load-more-images").val(paged);

          loader.hide();

          if (data === "") {
            loadMoreBtn.hide();
            $(".flexible-image-gallery-grid .grid-posts-action-control").html(
              '<div class="no-more-to-load"><p>No more images to load</p></div>'
            );
          } else {
            loadMoreBtn.show();
          }
        },
        complete: function () {
          //resize images
          resize_gallery_images();
        },
        error: function (errorThrown) {
          //loader.hide();
          loadMoreBtn.show();
        },
      });

      return false;
    });
  }

  /*
   *
   * Adjust Cart Widget
   *
   */

  function adjust_cart_widget_vertical_position() {
    var rpRightPanel = $(".rp-right-panel");
    //if admin bar is visible
    var adminBarHeight = 0;
    if ($("#wpadminbar").length > 0) {
      adminBarHeight = $("#wpadminbar").outerHeight();
    }
    var mainMenuHeight = $("header.classic-header").outerHeight(),
      foodMenuHeight = 0;

    if ($("#food-menu").is(":visible")) {
      foodMenuHeight = $("#food-menu").outerHeight();
    }

    if ($(window).width() < 1024) {
      if (!rpRightPanel.hasClass("initiated")) {
        rpRightPanel.addClass("initiated");
      }
    } else {
      //watch for shop menu
      if (!rpRightPanel.hasClass("initiated")) {
        rpRightPanel.addClass("initiated");
      }
      if ($("#food-menu").length > 0) {
        rpRightPanel.css("margin-top", mainMenuHeight);
      }
    }
  }

  //function to resize gallery images on
  function resize_gallery_images() {
    var maxHeight = -1;

    //get tallest image from tge first row
    $("#images-grid-wrapper .grid-image-gallery-row:first-child .image").each(
      function () {
        maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
      }
    );

    $(".grid-image-gallery-row").each(function () {
      $(".image img", this).each(function () {
        $(this).height(maxHeight);
      });
    });
  }
  function unset_height_gallery_images() {
    $(".grid-image-gallery-row").each(function () {
      $(".image img", this).each(function () {
        $(this).height("auto");
      });
    });
  }

  /*
   *
   * Move Referal Program email sharing fields in My Account
   *
   */
  if ($(".gens-refer-a-friend").length > 0) {
    //move share email section above social share
    $(".gens-referral_share__email").insertAfter($(".gens-raf__url"));
    //update label on email share field
    $(".gens-referral_share__email__title").text("Share via email");
  }

  /**
   * iFrame Videos
   */

  const iframeVideos = document.querySelectorAll(".iframe-video");
  const iframeVideoEl = document.getElementById("iframe-video-modal");
  const iframeVideoModal = new Foundation.Reveal($("#iframe-video-modal"));

  if (iframeVideos) {
    iframeVideos.forEach((item, i) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        var iframe = item.getAttribute("data-iframe");
        iframeVideoEl.querySelector(".modal-body .responsive-embed").innerHTML =
          iframe;
        iframeVideoModal.open();
      });
    });
  }
  if (iframeVideoEl) {
    //remove video when modal is closed
    iframeVideoEl
      .querySelector("button.close-button")
      .addEventListener("click", function () {
        iframeVideoEl.querySelector(".modal-body .responsive-embed").innerHTML =
          "";
      });
  }

  /**
   * Animated Words
   */
  const animatedWords = document.querySelectorAll(".animated-words .word");
  if (animatedWords) {
    setInterval(function () {
      animateWords(animatedWords);
    }, 1500);
  }
  function animateWords(words) {
    let total = words.length;
    let switchA = true;
    words.forEach((word, i) => {
      if (!word.classList.contains("animate-out") && switchA == true) {
        word.classList.add("animate-out");
        // animate it out
        if (words[i + 1]) {
          words[i + 1].classList.remove("animate-out");
        } else {
          words[0].classList.remove("animate-out");
        }
        switchA = false;
        return false;
      }
    });
  }

  /**
   * Landing Page Hero Get a Quote
   */

  const heroLpBtn = document.querySelector(".lp-hero a.button");

  if (heroLpBtn) {
    heroLpBtn.addEventListener("click", (e) => {
      let urlHash = heroLpBtn.hash.substr(1);
      if (urlHash && urlHash == "get-a-quote") {
        e.preventDefault();
        open_get_a_quote_modal("get-a-quote"); // pass the modal id
      }
    });
  }

  /**
   * Get a quote Modal
   */
  const getAquoteBtnDesktop = document.getElementById("get-a-catering-quote");
  const getAquoteBtnMobile = document.getElementById(
    "get-a-catering-quote-mobile"
  );

  const heroWithCategories = document.querySelector(".hero-product-categories");
  const textWithMapCta = document.querySelector(".flexible-text-with-map .cta");
  const colorBoxWithCta = document.querySelector(
    ".block-color-box-with-cta .cta"
  );

  if (heroWithCategories) {
    const ctaBtn = heroWithCategories.querySelector(
      ".hero-product-categories__cta a"
    );
    if (ctaBtn) {
      ctaBtn.addEventListener("click", (e) => {
        let urlHash = ctaBtn.hash.substr(1);
        if (urlHash) {
          e.preventDefault();
          open_get_a_quote_modal(urlHash); // pass the modal id
        }
      });
    }
  }

  if (textWithMapCta) {
    textWithMapCta.addEventListener("click", (e) => {
      let urlHash = textWithMapCta.hash.substr(1);
      if (urlHash) {
        e.preventDefault();
        open_get_a_quote_modal(urlHash); // pass the modal id
      }
    });
  }

  if (colorBoxWithCta) {
    colorBoxWithCta.addEventListener("click", (e) => {
      let urlHash = colorBoxWithCta.hash.substr(1);
      if (urlHash) {
        e.preventDefault();
        open_get_a_quote_modal(urlHash); // pass the modal id
      }
    });
  }
  if (getAquoteBtnDesktop) {
    getAquoteBtnDesktop.addEventListener("click", () => {
      open_get_a_quote_modal("get-a-catering-quote-modal");
    });
  }
  if (getAquoteBtnMobile) {
    getAquoteBtnMobile.addEventListener("click", () => {
      open_get_a_quote_modal("get-a-catering-quote-modal");
    });
  }

  function open_get_a_quote_modal(id) {
    //initiate modal
    const modalEl = document.getElementById(id);
    let modal = "";
    if (modalEl) {
      modal = new Foundation.Reveal($("#" + id));
    }
    //open modal
    modal.open();
  }

  // init datepicker in the quote form
  let getQuoteForm = $(".get-a-quote-modal .wpcf7");
  if (getQuoteForm) {
    getQuoteForm
      .find(".your-date-of-event input")
      .datepicker({ dateFormat: "dd/mm/yy" });
  }
});

/**
 * Scroll to div
 */

const links = document.querySelectorAll("a.scroll-to");
if (links) {
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      let id = link.href.split("#")[1];
      if (id) {
        e.preventDefault();
        smoothScroll(document.getElementById(id));
      }
    });
  });
}

function smoothScroll(target) {
  var scrollContainer = target;
  do {
    //find scroll container
    scrollContainer = scrollContainer.parentNode;
    if (!scrollContainer) return;
    scrollContainer.scrollTop += 1;
  } while (scrollContainer.scrollTop == 0);

  var targetY = 0;
  do {
    //find the top of target relatively to the container
    if (target == scrollContainer) break;
    targetY += target.offsetTop;
  } while ((target = target.offsetParent));

  scroll = function (c, a, b, i) {
    i++;
    if (i > 30) return;
    c.scrollTop = a + ((b - a) / 30) * i;
    setTimeout(function () {
      scroll(c, a, b, i);
    }, 20);
  };
  let offset = 0;
  if (window.innerWidth < 1600) {
    offset = 250;
  } else if (window.innerWidth > 1600) {
    offset = 180;
  }
  // start scrolling
  scroll(scrollContainer, scrollContainer.scrollTop, targetY - offset, 0);
}

/**
 * Build Your Box Product
 */

let buildYourBoxProduct = document.querySelector(".product-build-your-box");
if (buildYourBoxProduct) {
  let products = buildYourBoxProduct.querySelectorAll(".product-item");
  if (products) {
    products.forEach((product) => {
      var productInfoDiv = product.querySelector(".product-item__info");
      var showProdInfo = product.querySelector("button.info");
      if (showProdInfo) {
        showProdInfo.addEventListener("click", (e) => {
          e.preventDefault();
          productInfoDiv.classList.toggle("show-info");
          showProdInfo.classList.toggle("hide-info");
        });
      }
    });
  }
}

/**
 * Redirect Form #
 */

document.addEventListener(
  "wpcf7mailsent",
  function (event) {
    if (event.detail.contactFormId == "28022") {
      location = "https://feedwell.com.au/thank-you/";
    }
  },
  false
);

/**
 * Click on the main menu
 */
const mainMenuItems = document.querySelectorAll(".desktop-navigation a");
if (mainMenuItems) {
  mainMenuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      let hash = item.href.split("#")[1];
      if (hash == "") {
        e.preventDefault();
      }
    });
  });
}
