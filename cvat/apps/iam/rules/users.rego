package users
import data.utils

default allow = false

allow {
    utils.is_admin
}

allow {
    input.scope == utils.VIEW_SELF
}