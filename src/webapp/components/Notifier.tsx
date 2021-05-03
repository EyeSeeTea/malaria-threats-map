import React from "react";
import { connect } from "react-redux";
import { selectNotifications } from "../store/reducers/notifier-reducer";
import { addNotificationAction, dismissNotificationAction } from "../store/actions/notifier-actions";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { State } from "../store/types";

const mapStateToProps = (state: State) => ({
    notifications: selectNotifications(state),
});

const mapDispatchToProps = {
    addNotification: addNotificationAction,
    dismissNotification: dismissNotificationAction,
};
type OwnProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function Notifier({ notifications, dismissNotification }: Props) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (id: number) => {
        setOpen(false);
        dismissNotification(id);
    };

    return (
        <>
            {notifications.map(notification => (
                <Snackbar
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                    open={open}
                    autoHideDuration={5000}
                    onClose={() => handleClose(notification.id)}
                    message={notification.message}
                    key={notification.id}
                    action={
                        <IconButton size="small" aria-label="close" onClick={() => handleClose(notification.id)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                />
            ))}
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifier);
