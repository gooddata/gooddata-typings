// (C) 2020 GoodData Corporation
import {
    IGdcMessageEvent,
    getEventType,
    GdcProductName,
    IGdcMessageEnvelope,
    IDrillableItemsCommandBody,
    EmbeddedGdc
} from './common';

export namespace EmbeddedKpiDashboard {
    /**
     * Base type for KD events.
     */
    export type IGdcKdMessageEvent<T, TBody> = IGdcMessageEvent<GdcProductName.KPI_DASHBOARD, T, TBody>;

    /**
     * Base type for KD event data.
     */
    export type IGdcKdMessageEnvelope<T, TBody> = IGdcMessageEnvelope<GdcProductName.KPI_DASHBOARD, T, TBody>;

    /**
     * All KD command Types.
     */
    export enum GdcKdCommandType {
        /**
         * The command save a dashboard.
         */
        Save = 'saveDashboard',

        /**
         * The command cancel editing dashboard.
         */
        CancelEdit = 'cancelEdit',

        /**
         * The command delete existed dashboard.
         */
        Delete = 'deleteDashboard',

        /**
         * The command edit a dashboard.
         */
        SwitchToEdit = 'switchToEdit',

        /**
         * The command set drillable items.
         */
        DrillableItems = 'drillableItems',

        /**
         * The command set size of dashboard.
         */
        SetSize = 'setSize',

        /**
         * The command add widget to dashboard.
         */
        AddWidget = 'addWidget',

        /**
         * The command add filter to dashboard.
         */
        AddFilter = 'addFilter',

        /**
         * The command export a dashboard.
         */
        ExportToPdf = 'exportToPdf',

        /**
         * The command to add or update filter context
         */
        SetFilterContext = 'setFilterContext',

        /**
         * The command to remove filter item from current filter context
         */
        RemoveFilterContext = 'removeFilterContext',

        /**
         * The command to duplicate a KPI Dashboard
         */
        SaveAsDashboard = 'saveAsDashboard'
    }

    /**
     * All KD event types.
     */
    export enum GdcKdEventType {
        /**
         * Type represent that the dashboard listening for drilling event.
         */
        ListeningForDrillableItems = 'listeningForDrillableItems',

        /**
         * Type represent that the embedded content starts loading.
         */
        LoadingStarted = 'loadingStarted',

        /**
         * Type represent that The user does not have permissions to view or edit the content.
         */
        NoPermissions = 'noPermissions',

        /**
         * Type represent that an operation increasing the height of the hosting iframe is performed.
         */
        Resized = 'resized',

        /**
         * Type represent that the dashboard has been created and saved.
         */
        DashboardCreated = 'dashboardCreated',

        /**
         * Type represent that the content is fully loaded,
         * and the user has permissions to access the dashboard.
         */
        DashboardLoaded = 'loaded',

        /**
         * Type represent that the existing dashboard has been updated.
         */
        DashboardUpdated = 'dashboardUpdated',

        /**
         * Type represent that the dashboard is saved.
         *
         */
        DashboardSaved = 'dashboardSaved',

        /**
         * Type represent that the dashboard is deleted.
         *
         */
        DashboardDeleted = 'dashboardDeleted',

        /**
         * Type represent that the user cancels the creation of the dashboard.
         */
        DashboardCreationCanceled = 'dashboardCreationCanceled',

        /**
         * Type represent that the dashboard is switched to edit mode.
         */
        SwitchedToEdit = 'switchedToEdit',

        /**
         * Type represent that the dashboard is switched to view mode.
         */
        SwitchedToView = 'switchedToView',

        /**
         * Type represent that the platform is down.
         */
        Platform = 'platform',

        /**
         * Type represent that the widget is added to dashboard.
         *
         */
        WidgetAdded = 'widgetAdded',

        /**
         * Type represent that the filter is added to dashboard.
         *
         */
        FilterAdded = 'filterAdded',

        /**
         * Type represent that the export action is finished.
         */
        ExportedToPdf = 'exportedToPdf',

        /**
         * Type represent that the drill performed
         */
        Drill = 'drill',

        /**
         * Type represent that the filter context is changed
         */
        FilterContextChanged = 'filterContextChanged',

        /**
         * Type represent that the set filter context action is finished
         */
        SetFilterContextFinished = 'setFilterContextFinished',

        /**
         * Type represent that the remove filter context action is finished
         */
        RemoveFilterContextFinished = 'removeFilterContextFinished',

        /**
         * Type that represents started drill to URL. The event does not contain an URL. The event can be used as
         * notification to display a loading indicator as the URL resolving takes some time. The URL is sent in
         * DrillToUrlResolved event which is posted after the URL is resolved. The event also contains an ID that can
         * be matched with ID in subsequently posted DrillToUrlResolved event.
         */
        DrillToUrlStarted = 'drillToUrlStarted',

        /**
         * Type that represents resolved drill to URL. The event is sent after DrillToUrlStarted event was posted and
         * it contains the resolved URL. The event also contains an ID which can be matched with ID from
         * DrillToUrlStarted event.
         */
        DrillToUrlResolved = 'drillToUrlResolved'
    }

    /**
     * List of available commands. This is included in each event sent by KD.
     */
    export interface IKdAvailableCommands {
        /**
         * Array of available commands types.
         */
        availableCommands: GdcKdCommandType[];
    }

    /**
     * Save command body sent by outer application
     */
    export interface IKdSaveCommandBody {
        /**
         * Dashboard title - use as title of new dashboard or rename of saved dashboard
         */
        title: string;
    }

    /**
     * Saves current dashboard.
     *
     * Contract:
     *
     * -  if currently edited dashboard IS NOT eligible for save (empty, in-error), then CommandFailed event
     *    will be posted
     * -  if the specified title is invalid / does not match title validation rules, then CommandFailed event
     *    will be posted
     * -  otherwise dashboard WILL be saved with the title as specified in the body and the DashboardSaved event
     *    will be posted
     * -  the DashboardSaved event will be posted even when saving dashboard that has not changed but would
     *    otherwise be eligible for saving (not empty, not in-error)
     *
     * Note: sending Save command with different title means dashboard will be saved with that new title.
     */
    export type SaveDashboardCommand = IGdcKdMessageEvent<GdcKdCommandType.Save, IKdSaveCommandBody>;

    export type SaveDashboardCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.Save, IKdSaveCommandBody>;

    /**
     * Type-guard checking whether object is an instance of {@link SaveDashboardCommandData}.
     *
     * @param obj - object to test
     */
    export function isSaveDashboardCommandData(obj: any): obj is SaveDashboardCommandData {
        return getEventType(obj) === GdcKdCommandType.Save;
    }

    /**
     * Creates a new dashboard from an existing dashboard
     *
     * Contract:
     *
     * -  if KD saves as new an existing dashboard in view mode, the DashboardSaved event will be posted,
     * the new duplicated dashboard doesn't apply changes from the filter bar.
     *
     * -  if KD saves as new an existing dashboard in edit mode, the DashboardSaved event will be posted,
     * the new duplicated dashboard applies all changes from the existing dashboard like
     * title, filter context, insight widgets, layout...
     *
     * -  if KD saves as new an existing dashboard in the locked dashboard but the user can create new dashboard,
     * the DashboardSaved event will be posted, the new duplicated dashboard won't be locked.
     *
     * -  if KD doesn't have an existing dashboard, no permission to create dashboard or the title is empty,
     * CommandFailed is posted
     */
    export type SaveAsDashboardCommand = IGdcKdMessageEvent<GdcKdCommandType.SaveAsDashboard, IKdSaveCommandBody>;

    export type SaveAsDashboardCommandData = IGdcKdMessageEnvelope<
                                                GdcKdCommandType.SaveAsDashboard,
                                                IKdSaveCommandBody>;

    /**
     * Type-guard checking whether object is an instance of {@link SaveAsDashboardCommandData}.
     *
     * @param obj - object to test
     */
    export function isSaveAsDashboardCommandData(obj: any): obj is SaveAsDashboardCommandData {
        return getEventType(obj) === GdcKdCommandType.SaveAsDashboard;
    }

    /**
     * Cancels editing and switches dashboard to view mode.
     *
     * Contract:
     *
     * -  if KD is currently editing dashboard, this will trigger switch to view mode, without popping up the
     *    dialog asking to discard unsaved changes. On success SwitchedToView will be posted
     * -  if KD is currently viewing dashboard, SwitchedToView will be posted back immediately
     * -  if KD is not currently showing any dashboard, CommandFailed is posted
     */
    export type CancelEditCommand = IGdcKdMessageEvent<GdcKdCommandType.CancelEdit, null>;

    export type CancelEditCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.CancelEdit, null>;

    /**
     * Type-guard checking whether object is an instance of {@link CancelEditData}.
     *
     * @param obj - object to test
     */
    export function isCancelEditCommandData(obj: any): obj is CancelEditCommandData {
        return getEventType(obj) === GdcKdCommandType.CancelEdit;
    }

    /**
     * Deleted currently edited dashboard.
     *
     * Contract:
     *
     * -  if KD is currently editing dashboard, this will trigger delete without popping up the dialog
     *    asking for permission. On success DashboardDeleted will be posted
     *
     * -  if KD is currently viewing dashboard or not not showing any dashboard, CommandFailed will
     *    be posted
     */
    export type DeleteDashboardCommand = IGdcKdMessageEvent<GdcKdCommandType.Delete, null>;

    export type DeleteDashboardCommandData = IGdcKdMessageEnvelope<
        GdcKdCommandType.Delete,
        null
    >;

    /**
     * Switches current dashboard to edit mode.
     *
     * Contract:
     *
     * -  if KD shows dashboard in view mode, will switch to edit mode and post SwitchedToEdit once ready for
     *    editing
     * -  if KD shows dashboard in edit mode, will keep edit mode and post SwitchedToEdit as if just switched
     *    from view mode
     * -  if no dashboard currently displayed, posts CommandFailed
     */
    export type SwitchToEditCommand = IGdcKdMessageEvent<GdcKdCommandType.SwitchToEdit, null>;

    export type SwitchToEditCommandData = IGdcKdMessageEnvelope<
        GdcKdCommandType.SwitchToEdit,
        null
    >;

    /**
     * Type-guard checking whether object is an instance of {@link SwitchToEditCommandData}.
     *
     * @param obj - object to test
     */
    export function isSwitchToEditCommandData(obj: any): obj is SwitchToEditCommandData {
        return getEventType(obj) === GdcKdCommandType.SwitchToEdit;
    }

    /**
     * Set drillable items.
     *
     * Contract:
     *
     * - Drillable items can be set by uris or identifiers of dashboard's measures/attributes
     */
    export type DrillableItemsCommand = IGdcKdMessageEvent<
        GdcKdCommandType.DrillableItems,
        IDrillableItemsCommandBody
    >;

    /**
     * Data type of drillable items command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IDrillableItemsCommandBody
     */
    export type DrillableItemsCommandData = IGdcKdMessageEnvelope<
        GdcKdCommandType.DrillableItems,
        IDrillableItemsCommandBody
    >;

    /**
     * Type-guard checking whether object is an instance of {@link DrillableItemsCommandData}.
     *
     * @param obj - object to test
     */
    export function isDrillableItemsCommandData(obj: any): obj is DrillableItemsCommandData {
        return getEventType(obj) === GdcKdCommandType.DrillableItems;
    }

    export interface ISetSizeCommandBody {
        /**
         * the height of the hosting iframe
         */
        height: number;
    }

    export type SetSizeCommand = IGdcKdMessageEvent<GdcKdCommandType.SetSize, ISetSizeCommandBody>;

    export type SetSizeCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.SetSize, ISetSizeCommandBody>;

    /**
     * Type-guard checking whether object is an instance of {@link SetSizeCommandData}.
     *
     * @param obj - object to test
     */
    export function isSetSizeCommandData(obj: any): obj is SetSizeCommandData {
        return getEventType(obj) === GdcKdCommandType.SetSize;
    }

    /**
     * Data type of SetFilterContext command
     */
    export type SetFilterContextCommandData = IGdcKdMessageEnvelope<
        GdcKdCommandType.SetFilterContext,
        EmbeddedGdc.IFilterContextContent
    >;

    /**
     * Add or update the filter context
     *
     * Contract:
     * - If filters are same with filters on the KD filter bar, then update the filters on the filter bar
     *   and apply the filters to dashboard
     * - In edit mode, if filters are new and then add them to the KD filter bar and apply to dashboard
     * - In-case the KD can not apply the filters, a CommandFailed will be posted. The reason could be:
     *   - Add new filter in view mode
     *   - Filter is not existed in the dataset
     *   - Filter is existed but wrong elements input data
     *   - Exceed the limit number of filter items
     */
    export type SetFilterContextCommand = IGdcKdMessageEvent<
        GdcKdCommandType.SetFilterContext,
        EmbeddedGdc.IFilterContextContent
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link SetFilterContextCommand}
     *
     * @param obj - object to test
     */
    export function isSetFilterContextCommandData(obj: any): obj is SetFilterContextCommandData {
        return getEventType(obj) === GdcKdCommandType.SetFilterContext;
    }

    /**
     * Data type of removeFilterContext command
     */
    export type RemoveFilterContextCommandData = IGdcKdMessageEnvelope<
        GdcKdCommandType.RemoveFilterContext,
        EmbeddedGdc.IRemoveFilterContextContent
    >;

    /**
     * Remove the filter context
     * Contract:
     * - if filters are in the filter bar, then remove the filters on the filter bar and update insight
     * - if filters are not in the filter bar and then a CommandFailed will be posted.
     */
    export type RemoveFilterContextCommand = IGdcKdMessageEvent<
        GdcKdCommandType.RemoveFilterContext,
        EmbeddedGdc.IRemoveFilterContextContent
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link RemoveFilterContextCommand}
     *
     * @param obj - object to test
     */
    export function isRemoveFilterContextCommandData(obj: any): obj is RemoveFilterContextCommandData {
        return getEventType(obj) === GdcKdCommandType.RemoveFilterContext;
    }

    //
    // Add widget command
    //

    export interface IKpiWidget {
        type: 'kpi';
    }

    export interface IIdentifierInsightRef {
        identifier: string;
    }

    export interface IUriInsightRef {
        uri: string;
    }

    export interface IInsightWidget {
        type: 'insight';
        ref: IIdentifierInsightRef | IUriInsightRef;
    }

    export interface IAddWidgetBody {
        widget: IKpiWidget | IInsightWidget;
    }

    /**
     * Type-guard checking whether object is an instance of {@link IdentifierInsightRef}.
     *
     * @param obj - object to test
     */
    export function isIdentifierInsight(obj: any): obj is IIdentifierInsightRef {
        return obj.identifier;
    }

    /**
     * Type-guard checking whether object is an instance of {@link UriInsightRef}.
     *
     * @param obj - object to test
     */
    export function isUriInsight(obj: any): obj is IUriInsightRef {
        return obj.uri;
    }

    /**
     * Adds new widget onto dashboard. New row will be created on top of the dashboard, the widget
     * will be placed into its first column.
     *
     * It is currently possible to add either a KPI or an Insight. When adding either of these, KD will
     * scroll to top so that the newly added widget is visible.
     *
     * For KPI, the KD will start the KPI customization flow right after the KPI is placed.
     * Insights are placed without need for further customization
     *
     * Contract:
     *
     * -  if KD is currently editing a dashboard, then depending on widget type:
     *    -  KPI is added to dashboard, customization flow is started, WidgetAdded will be posted
     *    -  Insight is added to dashboard, WidgetAdded will be posted
     *
     * -  if insight reference included in command payload does not refer to a valid insight, CommandFailed
     *    will be posted
     *
     * -  if KD is in view mode or not showing any dashboard, then CommandFailed will be posted
     */
    export type AddWidgetCommand = IGdcKdMessageEvent<GdcKdCommandType.AddWidget, IAddWidgetBody>;

    export type AddWidgetCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.AddWidget, IAddWidgetBody>;

    /**
     * Type-guard checking whether object is an instance of {@link AddWidgetCommandData}.
     *
     * @param obj - object to test
     */
    export function isAddWidgetCommandData(obj: any): obj is AddWidgetCommandData {
        return getEventType(obj) === GdcKdCommandType.AddWidget;
    }

    /**
     * Adds new attribute filter to filter bar and starts the filter customization flow.
     *
     * Contract:
     *
     * -  if KD is currently editing a dashboard, adds new attribute filter, starts customization flow; FilterAdded
     *    will be posted right after customization starts
     *
     * -  if KD is currently in view mode or does not show any dashboard, will post CommandFailed
     */
    export type AddFilterCommand = IGdcKdMessageEvent<GdcKdCommandType.AddFilter, null>;

    export type AddFilterCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.AddFilter, null>;

    /**
     * Type-guard checking whether object is an instance of {@link AddFilterCommandData}.
     *
     * @param obj - object to test
     */
    export function isAddFilterCommandData(obj: any): obj is AddFilterCommandData {
        return getEventType(obj) === GdcKdCommandType.AddFilter;
    }

    /**
     * Exports dashboard to PDF.
     *
     * Contract:
     *
     * -  if KD shows dashboard in view mode, will export dashboard to PDF and post ExportFinished once ready for
     *    exporting
     * -  if KD shows dashboard in edit mode or not not showing any dashboard, CommandFailed will
     *    be posted
     */
    export type ExportToPdfCommand = IGdcKdMessageEvent<GdcKdCommandType.ExportToPdf, null>;

    export type ExportToPdfCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.ExportToPdf, null>;

    /**
     * Type-guard checking whether object is an instance of {@link ExportToPdfCommandData}.
     *
     * @param obj - object to test
     */
    export function isExportToPdfCommandData(obj: any): obj is ExportToPdfCommandData {
        return getEventType(obj) === GdcKdCommandType.ExportToPdf;
    }

    export interface INoPermissionsBody {
        /**
         * the 'data' section contains information about whether view or edit permissions are missing
         */
        reason: string;
    }

    /**
     * This event is emitted When User does not have permissions to view or edit the content
     */
    export type NoPermissionsEventData = IGdcKdMessageEnvelope<
        GdcKdEventType.NoPermissions,
        INoPermissionsBody
    >;

    export interface IResizedBody {
        height: number;
    }

    /**
     * This event is emitted when the content is fully loaded
     */
    export type ResizedEventData = IGdcKdMessageEnvelope<
        GdcKdEventType.Resized,
        IResizedBody
    >;

    export interface IDashboardObjectMeta {
        /**
         * Client id - Each client has an identifier unique within the domain
         *
         * Note: use the combination of the data product ID and client ID instead of the project ID
         */
        client?: string;

        /**
         * object id
         */
        dashboardId: string;
        /**
         * Project id
         */
        project: string;
        /**
         * dashboard identifier
         */
        dashboard: string;

        /**
         * dashboard title - this is what users see in KD top bar (if visible)
         */
        title: string;
    }

    export type IDashboardBody = IKdAvailableCommands & IDashboardObjectMeta;

    /**
     * Data type of event that was emitted when a dashboard has been created and saved.
     */
    export type IDashboardCreatedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardCreated,
        IDashboardBody
    >;

    /**
     * Data type of event that was emitted when the content is fully loaded,
     * and the user has permissions to access the dashboard.
     */
    export type IDashboardLoadedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardLoaded,
        IDashboardBody
    >;

    /**
     * Data type of event that was emitted when the existing dashboard has been updated.
     */
    export type IDashboardUpdatedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardUpdated,
        IDashboardBody
    >;

    /**
     * Data type of event that was emitted when the dashboard has been saved.
     */
    export type IDashboardSavedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardSaved,
        IDashboardBody
    >;

    /**
     * Data type of event that was emitted when the dashboard has been deleted.
     */
    export type IDashboardDeletedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardDeleted,
        IDashboardBody
    >;

    /**
     * This event is emitted after KD switched a dashboard from view mode to edit mode.
     */
    export type SwitchedToEditData = IGdcKdMessageEnvelope<
        GdcKdEventType.SwitchedToEdit,
        IDashboardBody
    >;

    /**
     * This event is emitted after KD switched a dashboard from edit mode to view mode.
     */
    export type SwitchedToViewData = IGdcKdMessageEnvelope<
        GdcKdEventType.SwitchedToView,
        IDashboardBody
    >;

    export interface IPlaformBody {
        status?: string;
        errorCode?: number;
        description?: string;
    }

    export type PlaformData = IGdcKdMessageEnvelope<GdcKdEventType.Platform, IPlaformBody>;

    export interface IInsightWidgetBody {
        widgetCategory: 'kpi' | 'visualization';
        identifier?: string;
        uri?: string;
        title?: string;
    }
    export interface IAddedWidgetBody {
        insight?: IInsightWidgetBody;
    }

    /**
     * This event is emitted after KD added a new widget to a dashboard. If the widget is
     * an insight, then meta information about the insight will be returned.
     *
     * Note: when this event is added for a KPI widget, it means the customization flow for the KPI has
     * started. The user may still 'just' click somewhere outside of the KPI configuration and the KPI will
     * be discarded.
     */
    export type WidgetAddedData = IGdcKdMessageEnvelope<GdcKdEventType.WidgetAdded, IAddedWidgetBody>;

    export type FilterAddedBody = IKdAvailableCommands;

    /**
     * This event is emitted after KD added a new filter to dashboard's filter bar and started its
     * customization flow.
     *
     * Note: users can still cancel the filter customization flow meaning no new attribute filter
     * will end on the filter bar.
     */
    export type FilterAddedData = IGdcKdMessageEnvelope<GdcKdEventType.FilterAdded, FilterAddedBody>;

    export type ExportToPdfFinishedBody = IKdAvailableCommands & {
        /**
         * Link to the file containing exported data.
         */
        link: string;
    };

    /**
     * This event is emitted after dashboard has been exported to PDF
     */
    export type ExportToPdfFinishedData = IGdcKdMessageEnvelope<GdcKdEventType.ExportedToPdf, ExportToPdfFinishedBody>;

    //
    // setFilterContext finished
    //

    /**
     * Data type of event that was emitted after finishing set filter context
     *
     * Note: The main event data was wrapped to application and product data structure
     */
    export type SetFilterContextFinishedData = IGdcKdMessageEnvelope<
        GdcKdEventType.SetFilterContextFinished,
        IKdAvailableCommands
    >;

    //
    // removeFilterContext finished
    //

    /**
     * Data type of event that was emitted after finishing remove filter context
     *
     * Note: The main event data was wrapped to application and product data structure
     */
    export type RemoveFilterContextFinishedData = IGdcKdMessageEnvelope<
        GdcKdEventType.RemoveFilterContextFinished,
        IKdAvailableCommands
    >;

    //
    // FilterContext changed
    //

    /**
     * Main data of Filter context changed event
     */
    export type FilterContextChangedBody = IKdAvailableCommands & EmbeddedGdc.IFilterContextContent;

    /**
     * Data type of event that was emitted after finishing change filter context
     *
     * Note: The main event data was wrapped to application and product data structure
     */
    export type FilterContextChangedData = IGdcKdMessageEnvelope<
        GdcKdEventType.FilterContextChanged,
        FilterContextChangedBody
    >;

    export interface IDrillToUrlStartedDataBody {
        id: string;
    }

    export interface IDrillToUrlResolvedDataBody {
        id: string;
        url: string;
    }

    export type DrillToUrlStartedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DrillToUrlStarted,
        IDrillToUrlStartedDataBody
    >;

    export type DrillToUrlResolvedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DrillToUrlResolved,
        IDrillToUrlResolvedDataBody
    >;
}
