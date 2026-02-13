(function () {
    'use strict';

    function toNumber(value) {
        var parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : NaN;
    }

    function formatNumber(value, digits) {
        if (!Number.isFinite(value)) {
            return '-';
        }
        return value.toFixed(digits);
    }

    function setResult(id, value, suffix) {
        var node = document.getElementById(id);
        if (!node) {
            return;
        }
        node.textContent = formatNumber(value, 1) + (suffix || '');
    }

    function calculate(event) {
        event.preventDefault();

        var weight = toNumber(document.getElementById('fluid-weight').value);
        var dehydrationPercent = toNumber(document.getElementById('fluid-dehydration').value);
        var maintenanceFactor = toNumber(document.getElementById('fluid-maintenance').value);

        if (!Number.isFinite(weight) || weight <= 0) {
            return;
        }

        if (!Number.isFinite(dehydrationPercent) || dehydrationPercent < 0) {
            return;
        }

        if (!Number.isFinite(maintenanceFactor) || maintenanceFactor <= 0) {
            return;
        }

        var deficitMl = weight * dehydrationPercent * 10;
        var maintenanceMlDay = weight * maintenanceFactor;
        var total24hMl = deficitMl + maintenanceMlDay;
        var hourlyMl = total24hMl / 24;

        setResult('fluid-deficit', deficitMl, ' mL');
        setResult('fluid-maint', maintenanceMlDay, ' mL/day');
        setResult('fluid-total', total24hMl, ' mL/24h');

        var hourlyNode = document.getElementById('fluid-hourly');
        if (hourlyNode) {
            hourlyNode.textContent = formatNumber(hourlyMl, 1) + ' mL/hour';
        }

        var shockNode = document.getElementById('fluid-shock');
        if (shockNode) {
            var dogLow = weight * 10;
            var dogHigh = weight * 20;
            var catLow = weight * 5;
            var catHigh = weight * 10;
            shockNode.textContent =
                'Shock bolus reminder: dog ' + formatNumber(dogLow, 0) + '-' + formatNumber(dogHigh, 0) + ' mL aliquots; ' +
                'cat ' + formatNumber(catLow, 0) + '-' + formatNumber(catHigh, 0) + ' mL aliquots, then reassess perfusion.';
        }
    }

    function init() {
        var form = document.getElementById('fluid-form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', calculate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
