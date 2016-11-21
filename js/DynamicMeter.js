(function(){
    "use strict";

    angular.module(
        'dynamic-meter-gauge',
        []
    ).directive('dynamicMeter',
        function(){
            return {
                restrict: 'E',
                template: '<div class="dynamic-meter"> <svg viewBox="-50 25 500 200" class="svg-content" xmlns="http://www.w3.org/2000/svg"> <g> <animate attributeType="CSS" attributeName="opacity" from="0" to="1" dur="3s"/> <path class="arc dynamic-arc1" d=""/> <path class="arc dynamic-arc2" d=""/> <path class="arc dynamic-arc3" d=""/> <path class="arc dynamic-arc4" d=""/> <path class="arc dynamic-arc5" d=""/> <g class="needleset" width="150"> <path d="M 200 195 L 90 200 L 200 205"></path> </g> <text x="190" y="220" fill="black" ng-show="showScore==true">{{score}}</text> </g> </svg></div>',
                // templateUrl:'../svgTemplate/svgmeter.html',
                scope: {
                    score: '=ngModel',
                    showScore: '=showScore'
                },
                link:  function($scope, $element, $attrs) {


                    function DynamicMeterArc() {


                        this.polarToCartesian = function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
                            this.angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                            return {
                                x: centerX + (radius * Math.cos(this.angleInRadians)),
                                y: centerY + (radius * Math.sin(this.angleInRadians))
                            };
                        }


                        this.describeArc = function describeArc(x, y, radius, startAngle, endAngle) {
                            this.start = this.polarToCartesian(x, y, radius, endAngle);
                            this.end = this.polarToCartesian(x, y, radius, startAngle);
                            this.arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
                            this.d = [
                                "M", this.start.x, this.start.y,
                                "A", radius, radius, 0, this.arcSweep, 0, this.end.x, this.end.y
                            ].join(" ");
                            return this.d;
                        }

                        this.scoreRotateNeedle = function scoreRotateNeedle(dynamicScore) {
                            if (isNaN(dynamicScore)) {
                                alert("Please enter an integer value");
                            }
                            if (dynamicScore < 0 || dynamicScore > 100) {
                                alert("We would like you to rate us in 0-100 please");
                                return false;
                            }
                            /* To convert the dynamic score into corresponding degree for needle to rotate */
                            dynamicScore = dynamicScore * 1.8;
                            /*
                             To rotate the needle to the desired score.
                             */
                            $('.needleset').css({
                                "transform": "rotate(" + dynamicScore + "deg)",
                                "transform-origin": "98% 50%"
                            });
                            /*
                             To keep the number in the needle tip without rotating (by rotating it in reverse direction)
                             */
                            $('.scoreInCircle').css({
                                "transform": "rotate(" + dynamicScore * -1 + "deg)",
                                "transform-origin": "50% 80%"
                            });
                        }
                    }


                    var objDynamicMeterArc = new DynamicMeterArc();
                    var els = document.querySelectorAll('.dynamic-arc1');
                    for (var i=0; i < els.length; i++) {
                        els[i].setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, -90, -54));
                    }
                    var els2 = document.querySelectorAll('.dynamic-arc2');
                    for (var i=0; i < els.length; i++) {
                        els2[i].setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, -53, -18));
                    }

                    var els3 = document.querySelectorAll('.dynamic-arc3');
                    for (var i=0; i < els.length; i++) {
                        els3[i].setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, -17, 18));
                    }

                    var els4 = document.querySelectorAll('.dynamic-arc4');
                    for (var i=0; i < els.length; i++) {
                        els4[i].setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, 19, 54));
                    }

                    var els5 = document.querySelectorAll('.dynamic-arc5');
                    for (var i=0; i < els.length; i++) {
                        els5[i].setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, 55, 90));
                    }


                    $scope.$watch('score', function () {
                        objDynamicMeterArc.scoreRotateNeedle($scope.score);
                    });
                    $scope.$watch('showScore', function () {
                        objDynamicMeterArc.scoreRotateNeedle($scope.showScore);
                    });
                }
            };

        });

})();


