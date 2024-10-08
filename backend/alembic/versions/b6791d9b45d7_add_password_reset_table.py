"""Add password reset table

Revision ID: b6791d9b45d7
Revises: aadce1bec683
Create Date: 2024-05-31 16:32:12.173611

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b6791d9b45d7"
down_revision = "aadce1bec683"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "reset_password_request",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("uuid_token", sa.String(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("uuid_token"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("reset_password_request")
    # ### end Alembic commands ###
