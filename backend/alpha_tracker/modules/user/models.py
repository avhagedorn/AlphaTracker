from pydantic import BaseModel

from alpha_tracker.db.models import UserPreferences


class UpdateUserPreferencesRequest(BaseModel):
    strategy_display_option: int


class DisplayUserPreferences(BaseModel):
    strategy_display_option: int

    @staticmethod
    def from_db(preferences: UserPreferences):
        return DisplayUserPreferences(
            strategy_display_option=preferences.strategy_display_option
        )
