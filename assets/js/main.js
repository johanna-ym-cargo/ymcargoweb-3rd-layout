/* ==========================================================================
   YM Cargo Transport Corp. - shared front-end behavior
   Vanilla JS, no dependencies. Progressive enhancement only: every page
   works with this file absent (nav links, forms, and content are all
   plain HTML underneath).
   ========================================================================== */
(function () {
    "use strict";

    /* ---- Mobile navigation drawer ------------------------------------- */
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("navMenu");
    var scrim = document.getElementById("navScrim");
    var navClose = document.getElementById("navClose");

    function closeNav() {
        if (!menu) return;
        menu.classList.remove("is-open");
        toggle && toggle.setAttribute("aria-expanded", "false");
        scrim && scrim.classList.remove("is-open");
        document.body.style.overflow = "";
    }
    function openNav() {
        if (!menu) return;
        menu.classList.add("is-open");
        toggle && toggle.setAttribute("aria-expanded", "true");
        scrim && scrim.classList.add("is-open");
        document.body.style.overflow = "hidden";
    }
    if (toggle && menu) {
        toggle.addEventListener("click", function () {
            var isOpen = menu.classList.contains("is-open");
            isOpen ? closeNav() : openNav();
        });
    }
    scrim && scrim.addEventListener("click", closeNav);
    navClose && navClose.addEventListener("click", closeNav);
    menu && menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeNav);
    });
    window.addEventListener("resize", function () {
        if (window.innerWidth > 991) closeNav();
    });

    /* ---- Back-to-top button -------------------------------------------- */
    var toTop = document.querySelector(".back-to-top");
    if (toTop) {
        var toggleToTop = function () {
            toTop.classList.toggle("is-visible", window.scrollY > 480);
        };
        window.addEventListener("scroll", toggleToTop, { passive: true });
        toggleToTop();
    }

    /* ---- Scroll-reveal for elements with .reveal ------------------------ */
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ---- Animated stat counters (data-count="500") ---------------------- */
    var counters = document.querySelectorAll("[data-count]");
    if (counters.length) {
        var animateCount = function (el) {
            var target = parseInt(el.getAttribute("data-count"), 10) || 0;
            var suffix = el.getAttribute("data-suffix") || "";
            var duration = 1400;
            var start = null;
            function step(ts) {
                if (!start) start = ts;
                var progress = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target).toLocaleString().replace(/,/g, ', ') + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target.toLocaleString().replace(/,/g, ', ') + suffix;
            }
            requestAnimationFrame(step);
        };
        if ("IntersectionObserver" in window) {
            var cio = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        cio.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });
            counters.forEach(function (el) { cio.observe(el); });
        } else {
            counters.forEach(animateCount);
        }
    }

    /* ---- Active nav link based on current page -------------------------- */
    // Excludes .btn (the "Get In Touch" CTA) on purpose: it's an action, not a
    // nav destination, and .navbar__menu a.is-active sets a navy text color
    // that would make the CTA's white-on-navy button label unreadable.
    var here = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".navbar__menu a[href]:not(.btn)").forEach(function (a) {
        var href = a.getAttribute("href");
        if (href === here || (here === "" && href === "index.html")) {
            a.classList.add("is-active");
            a.setAttribute("aria-current", "page");
        }
    });

    /* ---- Services sub-nav: highlight section in view --------------------- */
    var subnavLinks = document.querySelectorAll(".subnav a[href^='#']");
    if (subnavLinks.length && "IntersectionObserver" in window) {
        var sections = Array.prototype.map.call(subnavLinks, function (a) {
            return document.querySelector(a.getAttribute("href"));
        }).filter(Boolean);
        var sio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var link = document.querySelector(".subnav a[href='#" + entry.target.id + "']");
                if (!link) return;
                if (entry.isIntersecting) {
                    subnavLinks.forEach(function (l) { l.classList.remove("is-active"); });
                    link.classList.add("is-active");
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        sections.forEach(function (s) { sio.observe(s); });
    }

    /* ---- Careers: simple client-side job search / filter ----------------- */
    var jobSearch = document.getElementById("jobSearch");
    var jobFilter = document.getElementById("jobFilter");
    var jobItems = document.querySelectorAll(".job-item");
    var jobEmpty = document.getElementById("jobEmpty");
    function filterJobs() {
        if (!jobItems.length) return;
        var q = (jobSearch && jobSearch.value || "").trim().toLowerCase();
        var branch = (jobFilter && jobFilter.value) || "";
        var visible = 0;
        jobItems.forEach(function (item) {
            var text = item.textContent.toLowerCase();
            var itemBranch = item.getAttribute("data-branch") || "";
            var matches = (!q || text.indexOf(q) !== -1) && (!branch || itemBranch === branch);
            item.style.display = matches ? "" : "none";
            if (matches) visible++;
        });
        if (jobEmpty) jobEmpty.style.display = visible ? "none" : "block";
    }
    jobSearch && jobSearch.addEventListener("input", filterJobs);
    jobFilter && jobFilter.addEventListener("change", filterJobs);

    /* ---- Demo forms: prevent real submit, show confirmation -------------- */
    document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var note = form.querySelector("[data-form-status]");
            if (note) {
                note.textContent = "Thanks. This is a template demo, so nothing was actually sent. Wire this form up to your backend of choice.";
                note.hidden = false;
            }
            form.reset();
        });
    });

    /* ---- Branch Tabs Switching ------------------------------------------- */
    var tabLinks = document.querySelectorAll('#branch-tabs a[data-toggle="tab"]');
    if (tabLinks.length) {
        tabLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;

                tabLinks.forEach(function (l) {
                    l.classList.remove('active');
                    l.setAttribute('aria-selected', 'false');
                });
                link.classList.add('active');
                link.setAttribute('aria-selected', 'true');

                var tabPanes = document.querySelectorAll('#myTabContent .tab-pane');
                tabPanes.forEach(function (pane) {
                    pane.classList.remove('show', 'active');
                });
                var activePane = document.querySelector(targetId);
                if (activePane) {
                    activePane.classList.add('show', 'active');
                }

                // Reset map popups to clean state on tab switch
                document.querySelectorAll('.branch-map-div .popup').forEach(function (p) {
                    p.style.display = 'none';
                });

                // Highlight popup for active branch in current tab if expanded
                if (activePane) {
                    var activeItem = activePane.querySelector('.branch-accordion-item.active');
                    if (activeItem) {
                        var activePopupId = activeItem.getAttribute('data-popup');
                        if (activePopupId) {
                            var activePopupEl = document.getElementById(activePopupId);
                            if (activePopupEl) {
                                activePopupEl.style.display = 'block';
                            }
                        }
                    }
                }
            });
        });
    }

    /* ---- Branch Map Popups Hover & Accordion Toggle --------------------- */
    var branchItems = document.querySelectorAll('.branch-items[data-popup]');
    if (branchItems.length) {
        branchItems.forEach(function (item) {
            var popupId = item.getAttribute('data-popup');
            var popupEl = document.getElementById(popupId);
            if (!popupEl) return;
            item.addEventListener('mouseenter', function () {
                popupEl.style.display = 'block';
            });
            item.addEventListener('mouseleave', function () {
                if (!item.classList.contains('active')) {
                    popupEl.style.display = 'none';
                }
            });
        });
    }

    var accordionHeaders = document.querySelectorAll('.branch-accordion-header');
    if (accordionHeaders.length) {
        accordionHeaders.forEach(function (header) {
            header.addEventListener('click', function () {
                var item = header.closest('.branch-accordion-item');
                var parentAccordion = item.closest('.branch-accordion');
                
                if (parentAccordion) {
                    var siblings = parentAccordion.querySelectorAll('.branch-accordion-item');
                    siblings.forEach(function (sib) {
                        if (sib !== item) {
                            sib.classList.remove('active');
                        }
                    });
                }
                
                item.classList.toggle('active');

                var popupId = item.getAttribute('data-popup');
                if (popupId) {
                    var popupEl = document.getElementById(popupId);
                    if (popupEl) {
                        document.querySelectorAll('.branch-map-div .popup').forEach(function(p) { p.style.display = 'none'; });
                        if (item.classList.contains('active')) {
                            popupEl.style.display = 'block';
                        }
                    }
                }
            });
        });
    }

    /* ---- News Details Modal --------------------------------------------- */
    var newsModal = document.getElementById('newsModal');
    var modalImg = document.getElementById('modalNewsImg');
    var modalDate = document.getElementById('modalNewsDate');
    var modalTitle = document.getElementById('modalNewsTitle');
    var modalDesc = document.getElementById('modalNewsDesc');

    document.querySelectorAll('.news-card').forEach(function (card) {
        var readMoreBtn = card.querySelector('.news-card__link');
        if (!readMoreBtn) return;

        readMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            var imgEl = card.querySelector('.news-card__media img');
            var dateEl = card.querySelector('.news-card__date');
            var titleEl = card.querySelector('.news-card__body h3');
            var descEl = card.querySelector('.news-card__body p');

            if (modalImg && imgEl) modalImg.src = imgEl.src;
            if (modalDate && dateEl) modalDate.textContent = dateEl.textContent;
            if (modalTitle && titleEl) modalTitle.textContent = titleEl.textContent;
            if (modalDesc && descEl) {
                var fullText = card.getAttribute('data-full-text') || descEl.textContent;
                modalDesc.textContent = fullText;
            }

            if (newsModal) {
                newsModal.classList.add('is-open');
                newsModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (newsModal) {
        var closeBtns = newsModal.querySelectorAll('.news-modal__close, .news-modal__close-btn, .news-modal__backdrop');
        closeBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                newsModal.classList.remove('is-open');
                newsModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && newsModal.classList.contains('is-open')) {
                newsModal.classList.remove('is-open');
                newsModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    /* ---- Port Region Tab Switcher (Option 4) ----------------------------- */
    var portTabBtns = document.querySelectorAll('.port-tab-btn');
    if (portTabBtns.length) {
        portTabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var region = btn.getAttribute('data-region');
                portTabBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var panes = document.querySelectorAll('.port-tab-pane');
                panes.forEach(function (pane) { pane.classList.remove('active'); });
                var targetPane = document.getElementById('pane-' + region);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    /* ---- Port Split-View Region Filter (Option 6) ------------------------- */
    var splitMenuBtns = document.querySelectorAll('.split-menu-btn');
    if (splitMenuBtns.length) {
        splitMenuBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = btn.getAttribute('data-split-filter');
                splitMenuBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var tiles = document.querySelectorAll('.split-port-tile');
                tiles.forEach(function (tile) {
                    var group = tile.getAttribute('data-region-group');
                    if (filter === 'all' || group === filter) {
                        tile.classList.remove('hidden-tile');
                    } else {
                        tile.classList.add('hidden-tile');
                    }
                });
            });
        });
    }
})();
