export class UserDto {
    /**
     * @name JavaUserDto
     * @class
     * @property id {Number}
     * @property email {String}
     * @property phone {String}
     * @property name {String}
     * @property roleName {String}
     */

    /**
     * @param dto {JavaUserDto}
     */
    constructor(dto) {
        this._id = dto.id;
        this._email = dto.email;
        this._phone = dto.phone;
        this._name = dto.name;
        this._roleName = dto.roleName;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get phone() {
        return this._phone;
    }

    set phone(value) {
        this._phone = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get roleName() {
        return this._roleName;
    }

    set roleName(value) {
        this._roleName = value;
    }
}