import React, { CSSProperties, HTMLAttributes } from "react";
import clsx from "clsx";
import Select, { OptionProps } from "react-select";
import { createStyles, emphasize, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField, { BaseTextFieldProps } from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import CancelIcon from "@material-ui/icons/Cancel";
import { ValueContainerProps } from "react-select/src/components/containers";
import { ControlProps } from "react-select/src/components/Control";
import { MenuProps, NoticeProps } from "react-select/src/components/Menu";
import { MultiValueProps } from "react-select/src/components/MultiValue";
import { PlaceholderProps } from "react-select/src/components/Placeholder";
import { SingleValueProps } from "react-select/src/components/SingleValue";
import { Omit } from "@material-ui/types";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { MenuItem } from "@material-ui/core";
import { useFirstRender } from "./hooks/use-first-render";

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
        },
        chipFocused: {
            backgroundColor: emphasize(
                theme.palette.type === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
                0.08
            ),
        },
        noOptionsMessage: {
            padding: theme.spacing(1, 2),
        },
        singleValue: {
            fontSize: 16,
        },
        placeholder: {
            position: "absolute",
            left: 2,
            bottom: 6,
            fontSize: 16,
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

function NoOptionsMessage(props: NoticeProps<OptionType, false>) {
    return (
        <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> & HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
    return <div ref={inputRef} {...props} />;
}

function Control(props: ControlProps<OptionType, false>) {
    const {
        children,
        innerProps,
        innerRef,
        selectProps: { classes, TextFieldProps },
    } = props;

    return (
        <Paper className={classes.inputPaper}>
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
        </Paper>
    );
}

function Option(props: OptionProps<OptionType, false>) {
    const { t } = useTranslation("common");
    const value = props.children ? t(props.children.toString()) : "";
    const isFirstRender = useFirstRender();
    const isFocused = isFirstRender ? false : props.isFocused;
    //it doesn't have access to the control/selected value
    return (
        <MenuItem
            dense
            ref={props.innerRef}
            selected={isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 800 : 400,
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

type MuiPlaceholderProps = Omit<PlaceholderProps<OptionType, false>, "innerProps"> &
    Partial<Pick<PlaceholderProps<OptionType, false>, "innerProps">>;
function Placeholder(props: MuiPlaceholderProps) {
    const { selectProps, innerProps = {}, children } = props;
    return (
        <Typography color="textSecondary" className={selectProps.classes.placeholder} {...innerProps}>
            {children}
        </Typography>
    );
}

function SingleValue(props: SingleValueProps<OptionType>) {
    const { t } = useTranslation("common");
    const value = props.children ? t(props.children.toString()) : "";
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {value}
        </Typography>
    );
}

function ValueContainer(props: ValueContainerProps<OptionType, false>) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props: MultiValueProps<OptionType>) {
    const { t } = useTranslation("common");
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
};

export type Option = {
    label: string;
    value: string;
};

export default function IntegrationReactSelect({ suggestions = [], value, onChange, className, ...rest }: any) {
    const { t } = useTranslation("common");
    const classes = useStyles(rest);
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
        <div className={`${classes.root} ${className}`} role="listbox">
            <Select
                classes={classes}
                styles={selectStyles}
                components={components}
                options={R.sortBy<Option>(R.prop("label"), suggestions)}
                value={value}
                onChange={onChange}
                placeholder={t("options.select") + "..."}
                {...rest}
            />
        </div>
    );
}
