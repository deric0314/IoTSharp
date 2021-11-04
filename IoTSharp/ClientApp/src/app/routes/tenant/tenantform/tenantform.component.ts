import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppMessage } from '../../common/AppMessage';
import { MyValidators } from '../../common/validators/MyValidators';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-tenantform',
  templateUrl: './tenantform.component.html',
  styleUrls: ['./tenantform.component.less'],
})
export class TenantformComponent implements OnInit {
  isManufactorLoading: Boolean = false;

  optionList: any;
  @Input() id: string = '-1';

  nodes = [];

  title: string = '';

  loading = false;
  avatarUrl?: string;
  constructor(
    private _router: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private _httpClient: _HttpClient,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private drawerRef: NzDrawerRef<string>,
  ) {}
  form!: FormGroup;
  submitting = false;
  ngOnInit() {
    const { nullbigintid, zip, email, mobile } = MyValidators;
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      id: [Guid.EMPTY, []],
      eMail: [null, [email]],
      phone: [null, [mobile]],
      country: [null, []],
      province: [null, []],
      city: [null, []],
      street: [null, []],
      address: [null, []],
      zipCode: [null, [Validators.required, zip]],
    });

    if (this.id !== Guid.EMPTY) {
      this._httpClient.get('api/Tenants/' + this.id).subscribe(
        (x) => {
          this.form.patchValue(x.data);
        },
        (y) => {},
        () => {},
      );
    }
  }

  submit() {
    this.submitting = true;
    if (this.id !== Guid.EMPTY) {
      this._httpClient.put('api/Tenants/' + this.form.value.id, this.form.value).subscribe(
        (x) => {
          this.submitting = false;
          this.msg.create('success', '租户保存成功');
          this.close();
        },
        (y) => {},
        () => {},
      );
    } else {
      this._httpClient.post('api/Tenants', this.form.value).subscribe(
        (x) => {
          this.submitting = false;
          this.msg.create('success', '租户保存成功');
          this.close();
        },
        (y) => {},
        () => {},
      );
    }
  }
  close(): void {
    this.drawerRef.close(this.id);
  }
}
