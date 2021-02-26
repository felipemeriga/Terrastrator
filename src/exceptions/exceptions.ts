
// GENERAL WARNING AND ERROR EXCEPTIONS

export class ValidationError extends Error {
    constructor(message: any) {
        super(message);
        this.name = "ValidationError";
    }
}

export class WarningException extends Error {
    constructor(message: any) {
        super(message);
        this.name = "WarningException";
    }
}

// AWS EXCEPTIONS
export class AWSKeysNotSet extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "AWSKeysNotSet";
    }
}

export class AWSInvalidCredentials extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "AWSInvalidCredentials";
    }
}

export class AWSInvalidRegion extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "AWSInvalidRegion";
    }
}

export class InvalidBucket extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "InvalidBucket";
    }
}

export class BucketWrongRegion extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "BucketWrongRegion";
    }
}

// PROJECT EXCEPTIONS
export class ProjectValidationError extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "ProjectValidationError";
    }
}

export class DontCreateProject extends WarningException {
    constructor(message: any) {
        super(message);
        this.name = "DontCreateProject";
    }
}

// TERRAFORM EXCEPTIONS
export class TerraformNotInstalled extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "TerraformNotInstalled";
    }
}

export class LayersFolderDontExist extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "LayersFolderDontExist";
    }
}

export class LayersFolderEmpty extends WarningException {
    constructor(message: any) {
        super(message);
        this.name = "LayersFolderEmpty";
    }
}

export class LayerDontExist extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "LayerDontExist";
    }
}


export class EnvironmentFolderDontExist extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "EnvironmentFolderDontExist";
    }
}

export class EnvironmentFolderEmpty extends WarningException {
    constructor(message: any) {
        super(message);
        this.name = "EnvironmentFolderEmpty";
    }
}

export class EnvironmentDontExistForLayer extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "EnvironmentDontExistForLayer";
    }
}

export class EnvironmentDontExist extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "EnvironmentDontExist";
    }
}

export class InvalidAction extends ValidationError {
    constructor(message: any) {
        super(message);
        this.name = "InvalidAction";
    }
}
