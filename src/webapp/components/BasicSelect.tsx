import React, { CSSProperties, HTMLAttributes } from "react";
import clsx from "clsx";
import Select, { IndicatorProps, OptionProps } from "react-select";
import { emphasize, Theme, useTheme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { Typography, Paper, Chip, MenuItem } from "@mui/material";
import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import { ValueContainerProps } from "react-select/src/components/containers";
import { ControlProps } from "react-select/src/components/Control";
import { MenuProps, NoticeProps } from "react-select/src/components/Menu";
import { MultiValueProps } from "react-select/src/components/MultiValue";
import { PlaceholderProps } from "react-select/src/components/Placeholder";
import { SingleValueProps } from "react-select/src/components/SingleValue";
import { DistributiveOmit } from "@mui/types";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { useFirstRender } from "./hooks/use-first-render";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClearIcon from "@mui/icons-material/Clear";

export interface OptionType {
    label: string;
    value: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            pointerEvents: "all",
            flexGrow: 1,
            minWidth: 150,
        },
        inputPaper: {
            padding: theme.spacing(0.5, 1.5),
        },
        input: {
            cursor: "pointer",
            display: "flex",
            padding: 0,
            height: "auto",
            "& span": {
                backgroundColor: "transparent",
            },
        },
        valueContainer: {
            display: "flex",
            flex: 1,
            alignItems: "center",
            overflow: "hidden",
            flexWrap: (props: { isMulti?: boolean }) => (props.isMulti ? "wrap" : "nowrap"),
        },
        chip: {
            margin: theme.spacing(0.5, 0.25),
            overflow: "hidden",
            textOverflow: "ellipsis",
            background: "white",
            borderRadius: "5px",
        },
        chipFocused: {
            backgroundColor: emphasize(
                theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                0.08
            ),
        },
        noOptionsMessage: {
            padding: theme.spacing(1, 2),
        },
        singleValue: {
            fontSize: 14,
        },
        placeholder: {
            position: "absolute",
            left: 2,
            bottom: 6,
            fontSize: 14,
        },
        paper: {
            position: "absolute",
            zIndex: 1,
            marginTop: theme.spacing(1),
            left: 0,
            right: 0,
        },
        divider: {
            height: theme.spacing(2),
        },
    })
);
const plasmodiumOptions = ["P. falciparum", "P. vivax", "P. knowlesi", "P. malariae", "P. ovale"];

function NoOptionsMessage(props: NoticeProps<OptionType, false>) {
    return (
        <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> & HTMLAttributes<HTMLDivElement>;

const inputComponent = React.forwardRef((props: InputComponentProps, ref: any) => <div ref={ref} {...props} />);

const DropdownIndicator = () => <ArrowDropDownIcon />;

const ClearIndicator = (props: IndicatorProps<OptionType, false>) => (
    <ClearIcon color="disabled" sx={{ fontSize: 15 }} onClick={props.clearValue} />
);

function Control(props: ControlProps<OptionType, false>) {
    const {
        children,
        innerProps,
        innerRef,
        selectProps: { classes, TextFieldProps },
    } = props;

    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: classes.input,
                    ref: innerRef,
                    children,
                    ...innerProps,
                },
                disableUnderline: true,
            }}
            {...TextFieldProps}
        />
    );
}

function Option(props: OptionProps<OptionType, false>) {
    const { t } = useTranslation();
    const value = props.children ? t(props.children.toString()) : "";
    const isFirstRender = useFirstRender();
    const isFocused = isFirstRender ? false : props.isFocused;
    const plasmodiumStyles = plasmodiumOptions.includes(value) ? { fontStyle: "italic" } : {};

    //it doesn't have access to the control/selected value
    return (
        <MenuItem
            dense
            ref={props.innerRef}
            selected={isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 800 : 400,
                ...plasmodiumStyles,
            }}
            {...props.innerProps}
            title={value}
        >
            <Typography variant="inherit" noWrap>
                {value}
            </Typography>
        </MenuItem>
    );
}

type MuiPlaceholderProps = DistributiveOmit<PlaceholderProps<OptionType, false>, "innerProps"> &
    Partial<Pick<PlaceholderProps<OptionType, false>, "innerProps">>;
function Placeholder(props: MuiPlaceholderProps) {
    const { selectProps, innerProps = {}, children } = props;
    return (
        <Typography color="textPrimary" className={selectProps.classes.placeholder} {...innerProps}>
            {children}
        </Typography>
    );
}

function SingleValue(props: SingleValueProps<OptionType>) {
    const { t } = useTranslation();
    const value = props.children ? t(props.children.toString()) : "";

    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps} sx={{ width: "100%" }}>
            {plasmodiumOptions.includes(value) ? <i>{value}</i> : value}
        </Typography>
    );
}

function ValueContainer(props: ValueContainerProps<OptionType, false>) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props: MultiValueProps<OptionType>) {
    const { t } = useTranslation();
    const value = props.children ? t(props.children.toString()) : "";

    return (
        <Chip
            tabIndex={-1}
            label={value}
            className={clsx(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu(props: MenuProps<OptionType, false>) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
    DropdownIndicator,
    ClearIndicator,
};

export type Option = {
    label: string;
    value: string;
};

export default function IntegrationReactSelect({
    suggestions = [],
    value,
    onChange,
    className,
    classes,
    ...rest
}: any) {
    const { t } = useTranslation();
    const defaultClasses = useStyles(rest);
    const finalClasses = classes || defaultClasses;
    const theme = useTheme();

    const selectStyles = {
        input: (base: CSSProperties) => ({
            ...base,
            isFocused: true,
            color: theme.palette.text.primary,
            "& input": {
                font: "inherit",
            },
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? "red" : "blue",
            ":active": {
                backgroundColor: state.isSelected ? "green" : "yellow",
            },
        }),
    };

    return (
        <div className={`${finalClasses.root} ${className}`} role="listbox">
            <Select
                classes={finalClasses}
                styles={selectStyles}
                components={components}
                options={R.sortBy<Option>(R.prop("label"), suggestions)}
                value={value}
                onChange={onChange}
                placeholder={t("common.options.select") + "..."}
                {...rest}
            />
        </div>
    );
}
