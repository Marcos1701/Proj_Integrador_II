import { useRef, useEffect, useState } from "react";
import { init } from "echarts";
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

    setTimeout(() => {
        if (chart !== undefined) {
            chart.resize();
        }
    }, 800);

    useEffect(() => {
        if (chartRef.current !== null && !window.onload) {
            setChart(init(chartRef.current, theme));
        }
    }, [theme]);

    useEffect(() => {
        if (chart !== undefined && !window.onload) {
            chart.resize();
        }
    }, [chart]);

    useEffect(() => {
        // Update chart
        if (chart !== undefined && !window.onload) {
            chart.setOption(option, settings);
        }
    }, [chart, settings]);


    useEffect(() => {
        // Update chart
        if (chartRef.current !== null && !window.onload) {
            if (chart !== undefined) {
                chart.setOption(option, settings);
            }
        }
    }, [loading, theme]);
    // para fazer com que o gráfico seja responsivo, é necessário definir o width e height da div pai
    // para que o grafico não exceda o tamanho da div pai, é necessário definir overflow: hidden no css da div pai

    return <div ref={chartRef} style={{
        ...style,
        overflow: 'hidden'
    }} />;
}