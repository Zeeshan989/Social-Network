# Generated by Django 4.2.1 on 2023-07-28 18:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_post'),
    ]

    operations = [
        migrations.CreateModel(
            name='Likes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='liked_by', to=settings.AUTH_USER_MODEL)),
                ('post_liked', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_liked', to='network.post')),
            ],
        ),
    ]