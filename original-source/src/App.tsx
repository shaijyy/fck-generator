import React, {CSSProperties, ReactElement, RefObject, useEffect, useMemo, useRef, useState} from 'react';
import {Button, ConfigProvider, Divider, Drawer, Input, InputNumber, Select, Typography} from 'antd';
import {DownloadOutlined, EditOutlined, TagOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import './App.scss';
import {analytics, logEvent } from './firebase';
const { Text, Title } = Typography;

const canvasSize = 350;

const App = () => {
  const [secondRowText, setSecondRowText] = useState<string>('SMT');
  const [padding, setPadding] = useState<number>(20);
  const [stripeHeight, setStripeHeight] = useState<number>(25);
  const [stripesColor, setStripesColor] = useState<string>("#FF0000"); // Use hex color code
  const [fontColor, setFontColor] = useState<string>("#FFFFFF"); // Use hex color code
  const [fontFamily, setFontFamily] = useState<string>("Raleway"); // Use hex color code
  const [bgColor, setBgColor] = useState<string>("#000000"); // Use hex color code
  const [drawerOpen, setDrawerOpen] = useState(false);
  const firstLineRef = useRef<HTMLDivElement>(null);
  const secondLineRef = useRef<HTMLDivElement>(null);

  const handleSecondRowTextChange = (e: any) => {
    setSecondRowText(e.target.value.toUpperCase());
  };

  const handleDownload = () => {
    logEvent(analytics, 'download_click', {
      text: secondRowText
    });
    const element = document.getElementById('design-container');
    if (element) {
      html2canvas(element, { scale: 2 }).then((canvas: any) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `fck-${secondRowText}.png`;
        link.href = image;
        link.click();
      });
    }
  };

  const handleRedirectToPrint = () => {
    logEvent(analytics, 'affiliate_click', {
      text: secondRowText
    });
    window.open('https://www.printful.com/make-your-own-shirt/a/10377124:d92a1519bedeeca7674eab157ad7bb06', "_blank")
  };

  const rowHeight = useMemo(() => (canvasSize - 2 * padding - 45 - 2 * stripeHeight) / 2, [padding, canvasSize, stripeHeight])
  const defaultFontSize = rowHeight * 1.33;
  const [secondRowFontSize, setSecondRowFontSize] = useState(defaultFontSize);

  const designContainerStyle: CSSProperties = {
    backgroundColor: bgColor,
    color: fontColor,
    padding: `${padding}px`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: canvasSize,
    position: 'relative',
    width: canvasSize,
    fontWeight: "bold",
    fontFamily: fontFamily,
    whiteSpace: "nowrap",
    overflow: "hidden",
    boxShadow: "0 0 14px 5px #c2c2c2"
  };

  const getRowFilledWithText = (text: string, rowHeight: number, fontSize: number, ref: RefObject<HTMLDivElement>, corrections = {}) => {
    const shouldFillRowWidth = text.length > 2;
    return <div
        ref={ref}
        style={{
          display: "flex",
          justifyContent: shouldFillRowWidth ? "space-between" : "center",
          alignItems: "center",
          width: "100%",
          height: rowHeight,
          lineHeight: `${rowHeight}px`,
          color: fontColor,
          fontSize,
          ...corrections
        }}>
      {text.split("").map(char => <span>{char}</span>)}
    </div>
  }

  const calculateSecondRowSize = () => {
    if (secondLineRef.current) {
      const el = secondLineRef.current;
      if (el.scrollWidth > el.clientWidth) {
        setSecondRowFontSize((secondRowFontSize || rowHeight) - 1);
      }
    }
  }

  useEffect(() => {
    setSecondRowFontSize(defaultFontSize);
    setTimeout(() => calculateSecondRowSize());
  }, [secondRowText])

  useEffect(() => {
    if (secondLineRef.current) {
      const el = secondLineRef.current;
      if (el.scrollWidth > el.clientWidth) {
        setSecondRowFontSize(secondRowFontSize - 1);
      }
    }
  }, [secondLineRef, secondRowFontSize, padding, stripeHeight, fontFamily])

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      screen_name: 'Home'
    });
  }, []);

  return (
      <ConfigProvider theme={{
        token: {
          colorPrimary: "black",
          fontFamily: "Outfit",
          fontWeightStrong: 300
        }
      }}>
        <div className="fck">
          <div className="fck__title">
            <Title level={1}>FCK GENERATOR</Title>
            <Title level={2}>Generate your own FCK design!</Title>
          </div>
          <div className="fck__preview">
            <div id="design-container" style={designContainerStyle}>
              <div style={{backgroundColor: stripesColor, height: `${stripeHeight}px`, width: '100%'}}></div>
              {getRowFilledWithText("FCK", rowHeight, defaultFontSize, firstLineRef, {
                marginLeft: -6,
                letterSpacing: 3,
                width: `calc(100% + 12px)`
              })}
              {getRowFilledWithText(secondRowText, secondRowFontSize * 0.77, secondRowFontSize, secondLineRef)}
              <div style={{backgroundColor: stripesColor, height: `${stripeHeight}px`, width: '100%'}}></div>
            </div>
          </div>
          <div className="fck__btns">
            <Button size="large" type="default" shape="circle" icon={<EditOutlined/>} onClick={() => setDrawerOpen(!drawerOpen)}></Button>
            <Button type="default" onClick={handleDownload} size="large" shape="circle" icon={<DownloadOutlined />} ></Button>
            <Button type="primary" onClick={handleRedirectToPrint} size="large" style={{
              background: "#292929"
            }}>
              <TagOutlined />
              Print T-Shirt!
            </Button>
          </div>
          <Drawer title="Customize Your Design" placement="right" mask={false} onClose={() => setDrawerOpen(false)}
                  open={drawerOpen}>
            <div className="fck__controls">
              <Text type="secondary">Second row text:</Text>
              <Input value={secondRowText} onChange={handleSecondRowTextChange}
                     placeholder="Enter text for second row"/>
              <Divider/>
              <Text type="secondary">Background color:</Text>
              <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{
                width: "50%"
              }}/>
              <Text type="secondary">Stripes color:</Text>
              <Input type="color" value={stripesColor} onChange={(e) => setStripesColor(e.target.value)} style={{
                width: "50%"
              }}/>
              <Text type="secondary">Font color:</Text>
              <Input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} style={{
                width: "50%"
              }}/>
              <Divider/>
              <Text type="secondary">Font:</Text>
              <Select
                  value={fontFamily}
                  onChange={setFontFamily}
                  options={[
                    { value: 'Outfit', label: 'Outfit' },
                    { value: 'Raleway', label: 'Raleway' },
                  ]}
              />
              <Text type="secondary">Padding:</Text>
              <InputNumber min={0} max={100} value={padding} onChange={(value) => setPadding(value || 0)}/>
              <Text type="secondary">Stripes thickness:</Text>
              <InputNumber min={0} max={100} value={stripeHeight} onChange={(value) => setStripeHeight(value || 0)}/>
            </div>
          </Drawer>
        </div>
      </ConfigProvider>
  );
};

export default App;
