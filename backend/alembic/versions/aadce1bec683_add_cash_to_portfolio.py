"""Add cash to portfolio

Revision ID: aadce1bec683
Revises: 99be8da37129
Create Date: 2024-05-28 12:59:35.772864

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "aadce1bec683"
down_revision = "99be8da37129"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "portfolio",
        sa.Column("cash_in_cents", sa.Integer(), nullable=False, server_default="0"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("portfolio", "cash_in_cents")
    # ### end Alembic commands ###
