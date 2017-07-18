
// Enrico Simonetti
// enricosimonetti.com
//
// 2017-07-18 on Sugar 7.9.0.0
// filename: custom/modules/Contacts/clients/base/views/pie-chart-dashlet/pie-chart-dashlet.js 

({
    plugins: ['Dashlet', 'Chart'],

    chart: {},
    chartData: {},
    total: 100,

    initialize: function (options) {
        this._super('initialize', [options]);

        this.chart = nv.models.pieChart()
            .x(function(d) {
                return d.key;
            })
            .y(function(d) {
                return d.value;
            })
            .margin({top: 0, right: 0, bottom: 0, left: 0})
            .donut(true)
            .donutLabelsOutside(true)
            .donutRatio(0.447)
            .rotateDegrees(0)
            .arcDegrees(360)
            .maxRadius(110)
            .hole(this.total)
            .showTitle(false)
            .tooltips(true)
            .showLegend(false)
            .direction(app.lang.direction)
            .colorData('data')
            .tooltipContent(function(key, x, y, e, graph) {
                return '<p><b>' + key + ' ' + parseInt(y, 10) + '</b></p>';
            })
            .strings({
                noData: app.lang.get('LBL_CHART_NO_DATA')
            });

    },

    hasChartData: function() {
        return !_.isEmpty(this.chartData) && !_.isEmpty(this.chartData.data) && this.chartData.data.length > 0;
    },

    renderChart: function() {
        if (!this.isChartReady()) {
            return;
        }

        this.chart.hole(this.total);
    
        d3.select(this.el).select('svg#' + this.cid).datum(this.chartData).call(this.chart);

        this.chart_loaded = _.isFunction(this.chart.update);
        this.displayNoData(!this.chart_loaded);

        nv.utils.windowResize(function() { this.chart.update(); });
    },

    loadData: function(options) {
        if(_.isUndefined(this.model)) {
            return;
        }

        var self = this;
        var record_id = this.model.get('id');

        app.api.call('READ', app.api.buildURL('Contacts/' + record_id + '/commission'), null, {
            success: function(data) {
                if(self.disposed) {
                    return;
                }
                self.chartData.data = data;
                self.renderChart();
            },
            error: function(error) {
                app.alert.show("server-error", {
                    level: 'error',
                    messages: 'ERR_GENERIC_SERVER_ERROR',
                    autoClose: false
                });
                app.error.handleHttpError(error);
            },
            complete: options ? options.complete : null
        });
    }
})
