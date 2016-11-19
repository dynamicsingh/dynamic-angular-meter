(function(){
    "use strict";

    angular.module(
        'dynamic-meter-gauge',
        []
    ).directive('dynamicMeter',
        function(){
        return {
            restrict: 'E',
            template: '<div id="dynamic-meter"> <svg viewBox="-50 25 500 200" class="svg-content" xmlns="http://www.w3.org/2000/svg"> <g> <animate attributeType="CSS" attributeName="opacity" from="0" to="1" dur="3s"/> <path class="arc" id="dynamic-arc1" d=""/> <path class="arc" id="dynamic-arc2" d=""/> <path class="arc" id="dynamic-arc3" d=""/> <path class="arc" id="dynamic-arc4" d=""/> <path class="arc" id="dynamic-arc5" d=""/> <g class="needleset" width="150"> <path d="M 200 195 L 90 200 L 200 205"></path> </g> <text x="190" y="220" fill="black" ng-show="showScore==true">{{score}}</text> </g> </svg></div>',
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
                document.getElementById("dynamic-arc1").setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, -90, -54));
                document.getElementById("dynamic-arc2").setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, -53, -18));
                document.getElementById("dynamic-arc3").setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, -17, 18));
                document.getElementById("dynamic-arc4").setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, 19, 54));
                document.getElementById("dynamic-arc5").setAttribute("d", objDynamicMeterArc.describeArc(200, 200, 100, 55, 90));

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


