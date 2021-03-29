declare enum PrintJobStatusEnum {
    Error = 3,
    Finished = 2,
    InQueue = 5,
    InvalidJobId = -3,
    NotSpooled = -4,
    PaperOut = 4,
    PrinterBusy = -2,
    Printing = 1,
    ProcessingError = -1,
    Unknown = 0
  }
  
  declare type PrintJobStatus = PrintJobStatusEnum.Error
    | PrintJobStatusEnum.Finished
    | PrintJobStatusEnum.InQueue
    | PrintJobStatusEnum.InvalidJobId
    | PrintJobStatusEnum.NotSpooled
    | PrintJobStatusEnum.PaperOut
    | PrintJobStatusEnum.PrinterBusy
    | PrintJobStatusEnum.Printing
    | PrintJobStatusEnum.ProcessingError
    | PrintJobStatusEnum.Unknown
  
  declare type PrinterType = "LabelWriterPrinter" | "TapePrinter"
  
  declare type AddressBarcodePosition = "AboveAddress" | "BelowAddress" | "Suppress"
  
  declare type FlowDirection = "LeftToRight" | "RightToLeft"
  
  declare type LabelWriterPrintQuality = "Auto" | "BarcodeAndGraphics" | "Text"
  
  declare type TapeAlignment = "Center" | "Left" | "Right"
  
  declare type TapeCutMode = "AutoCut" | "ChainMarks"
  
  declare type DymoTwinTurboRoll = "Left" | "Right"
  
  interface DymoEnvironment {
    isBrowserSupported: boolean
    isFrameworkInstalled: boolean
    isWebServicePresent: boolean,
    errorDetails: string
  }
  
  interface PrintJob {
    getStatus(replyCallback: (printJobStatusInfo: PrintJobStatusInfo) => any): void
  }
  
  interface PrintJobStatusInfo {
    statusMessage: string;
    status: PrintJobStatus;
  }
  
  
  declare interface Printer {
    isAutoCutSupported: boolean,
    isConnected: boolean,
    isLocal: boolean
    isTwinTurbo: boolean
    modelName: string
    name: string //return print queue name on mac
    printerType: PrinterType
  }
  
  
  declare interface ILabel {
    getAddressBarcodePosition: (index: number) => AddressBarcodePosition
    getAddressObjectCount: () => number
    getAddressText: () => string
    getLabelXml: () => string
    getObjectNames: () => string[]
    getObjectNamesAsync: () => Promise<string[]>
    getObjectText: (objectName: string) => string
    print: (printerName: string, printParamsXml: string, labelSetXml: string) => void
    printAsync: (printerName: string, printParamsXml: string, labelSetXml: string | null) => Promise<void>
    render: (renderParamsXml?: string, printerName?: string) => string
    renderAsync: (renderParamsXml?: string, printerName?: string) => Promise<string>
    setAddressBarcodePosition: (addressIndex: number, bacodePosition: AddressBarcodePosition) => ILabel //self
    setAddressText: (addressIndex: number, text: string) => ILabel //self
    setObjectText: (objectName: string, text: string) => ILabel //self
    isDCDLabel: () => boolean
    isDLSLabel: () => boolean
    isValidLabel: () => boolean
  }
  
  interface ILabelSetRecord {
    setBase64Image(objectName: string, base64Image: string): ILabelSetRecord;
    setText(objectName: string, text: string): ILabelSetRecord;
    setTextMarkup(objectName: string, textMarkup: string): ILabelSetRecord;
  }
  
  declare class LabelSetBuilder {
    static toXml: (records: {}[]) => string
    addRecord: () => ILabelSetRecord
    getRecords: () => ILabelSetRecord[]
    toString: () => string
  }
  
  interface CreateLabelRenderParamsXmlParams {
    /** The color of the label. */
    labelColor?: string;
    /** The color of label shadow. */
    shadowColor?: string;
    /** The shadow width in TWIPS. If '0' is specified, no shadow is rendered. */
    shadowDepth?: number;
    /**  The direction of the label content on the label (left-to-right or right-to-left). Use the dymo.label.framework.FlowDirection enumeration to specify the value. */
    flowDirection?: FlowDirection;
    /**
     * If true, the PNG will be generated using the display resolution.
     * If false, the PNG will be generated using the printer resolution.
     * If the display resolution is used, the resulting PNG will be smaller.
     * Use the printer resolution if the resulting image will be zoomed. This will give the zoomed preview better quality.
     */
    pngUseDisplayResolution?: boolean;
  }
  
  interface Framework {
    AddressBarcodePosition: AddressBarcodePosition
    FlowDirection: FlowDirection
    LabelWriterPrintQuality: LabelWriterPrintQuality
    TapeAlignment: TapeAlignment
    TwinTurboRoll: DymoTwinTurboRoll
    TapeCutMode: TapeCutMode
    LabelSetBuilder: LabelSetBuilder
    checkEnvironment: () => DymoEnvironment
    createLabelWriterPrintParamsXml: (params: { copies?: number, jobTitle?: string, flowDirection?: FlowDirection, printQuality?: LabelWriterPrintQuality, twinTurboRoll?: DymoTwinTurboRoll }) => string
    getLabelWriterPrinters: () => Printer[]
    getLabelWriterPrintersAsync: () => Promise<Printer[]>
    getPrinters: () => Printer[]
    init: (callbackFunction?: any) => void
    openLabelFile: (fileName: string) => ILabel //The fileName can be an http:// or file:// URL. On Windows the file name can be a regular file name, for example 'c:\users\desktop\address.label'.
    openLabelXml: (xmlLabelText: string) => ILabel
    printLabel: (printerName: string, printParamsXml: string, labelXml: string, labelSetXml?: string) => void
    printLabelAsync: (printerName: string, printParamsXml: string, labelXml: string, labelSetXml?: string) => void
    printLabel2: (printerName: string, printParamsXml: string, labelXml: string, labelSetXml: string) => void
    printLabel2Async: (printerName: string, printParamsXml: string, labelXml: string, labelSetXml: string) => void
    printLabelAndPollStatus: (printerName: string, printParamsXml: string, labelXml: string, labelSetXml?: string, statusCallback?: (printJob: PrintJob, printJobStatusInfo: PrintJobStatusInfo) => boolean, pollInterval?: number) => PrintJob
    printLabelAndPollStatusAsync: (printerName: string, printParamsXml: string, labelXml: string, labelSetXml?: string, statusCallback?: (printJob: PrintJob, printJobStatusInfo: PrintJobStatusInfo) => boolean, pollInterval?: number) => PrintJob
    renderLabel: (labelXml: string, renderParamsXml?: string, printerName?: string) => string
    renderLabelAsync: (labelXml: string, renderParamsXml?: string, printerName?: string) => Promise<string>
    createLabelRenderParamsXml: (params: CreateLabelRenderParamsXmlParams) => string
    VERSION: string
  }
  
  interface Label {
    framework: Framework
  }
  
  interface DymoStatic {
    label: Label
  }
  
  declare const dymo: DymoStatic