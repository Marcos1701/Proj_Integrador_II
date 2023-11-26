import React, { useRef, useEffect, useState } from "react";
import { init, getInstanceByDom } from "echarts";
import type { CSSProperties } from "react";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";
import { LiquidFillGaugeOption } from "../interface";

export interface ReactEChartsProps {
    option: EChartsOption | LiquidFillGaugeOption;
    style?: CSSProperties;
    settings?: SetOptionOpts;
    loading?: boolean;
    theme?: "light" | "dark";
}

export function ReactECharts({
    option,
    style,
    settings,
    loading,
    theme,
}: ReactEChartsProps): JSX.Element {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chart, setChart] = useState<ECharts | undefined>();
    useEffect(() => {
        if (chartRef.current !== null) {
            setChart(init(chartRef.current, theme));
        }
    }, [theme]);

    useEffect(() => {
        if (chart !== undefined) {
            chart.resize();

            return () => {
                chart.dispose();
            };
        }
    }, [chart]);

    useEffect(() => {
        // Update chart
        if (chart !== undefined) {
            chart.setOption(option, settings);

            if (loading) {
                chart.showLoading();
            } else {
                chart.hideLoading();
            }
        }
    }, [chart, settings]);


    useEffect(() => {
        // Update chart
        if (chartRef.current !== null) {
            if (chart !== undefined) {
                chart.setOption(option, settings);
            }

            if (loading) {
                getInstanceByDom(chartRef.current)?.showLoading();
            } else {
                getInstanceByDom(chartRef.current)?.hideLoading();
            }
        }
    }, [loading, theme]);

    return <div ref={chartRef} style={{ width: "100%", height: "100px", ...style }} />;
}