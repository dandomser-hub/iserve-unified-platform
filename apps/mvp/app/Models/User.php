<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name',
    'email',
    'password',
    'is_active',
    'barangay_code',
    'municipality_code',
    'failed_login_attempts',
    'locked_until',
    'last_login_at',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    public function hasPermission(string $permission): bool
    {
        return $this->roles()
            ->whereHas(
                'permissions',
                fn ($query) => $query->where('permissions.code', $permission),
            )
            ->exists();
    }

    /**
     * @return list<string>
     */
    public function permissionCodes(): array
    {
        return $this->roles()
            ->with('permissions:id,code')
            ->get()
            ->flatMap->permissions
            ->pluck('code')
            ->unique()
            ->sort()
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    public function roleCodes(): array
    {
        return $this->roles()
            ->pluck('code')
            ->sort()
            ->values()
            ->all();
    }

    public function hasRole(string $role): bool
    {
        return $this->roles()->where('code', $role)->exists();
    }

    protected function email(): Attribute
    {
        return Attribute::make(
            set: fn (string $value): string => mb_strtolower(trim($value)),
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'locked_until' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }
}
