<template>
	<div>
		<a-table :columns="Columns" :data-source="record" :pagination="false" rowKey="id" bordered>
			<a slot="name" slot-scope="text">{{ text }}</a>
			<span slot="action" slot-scope="text, record, index">
				<a-button @click="handleClick(text, record, index)" type="primary">查看详情</a-button>
			</span>
		</a-table>
		<div>
			<a-modal :title="tanDatas.studio_name" :visible="visible" cancelType="primary" width="60%" @cancel="cancelClick" @ok="handleOk" :centered="true">
				<div class="box">
					<div>工作室名称：{{ tanDatas.studio_name }}</div>
					<div>负责人：{{ tanDatas.teacher_name }}</div>
					<div v-if="tanDatas.grade != ''">工作室等级：{{ tanDatas.grade == 0 ? "C级" : tanDatas.grade == 1 ? "B级" : "A级" }}</div>
					<div>
						工作室工作内容：
						<p class="sj">{{ tanDatas.job_content }}</p>
					</div>
					<a-button type="primary" class="downLoad" v-if="hasFile" @click="download(tanDatas.id)">下载附件</a-button>
				</div>

				<!-- <a-modal title="请输入置换方案编号" :visible="bianhao" :centered="true" @cancel="() => (this.bianhao = false)">
					<a-input placeholder="请输入置换方案编号" v-model="examine.project_code" />
					<div slot="footer">
						<a-button @click="() => (this.bianhao = false)">取消</a-button>
						<a-button @click="sub_OK" type="primary" :loading="okLoading">提交</a-button>
					</div>
				</a-modal> -->
				<a-divider>课程置换方案名单</a-divider>
				<a-table
					:columns="columns2"
					:data-source="tableDatas"
					:pagination="false"
					:rowKey="
						(record, index) => {
							return index;
						}
					"
					bordered
				>
					<!-- slot中的name是指scopedSlots中customRender  slot-scope="text"的text就是数据源里的值赋值给text  -->
					<!-- 定义头部名称时 slot等于columns中的slots的title的值，然后赋值 -->
					<span slot="action" slot-scope="text, record, index">
						<a-button @click="handleClick(text, record, index)" type="primary">查看详情</a-button>
					</span>
				</a-table>
				<a-divider>直接管理单位</a-divider>
				<a-tag color="green">同意</a-tag>
				<div>直接管理单位：{{ tanDatas.management_unit_name }}</div>
				<div>审核人：{{ tanDatas.management_unit_signer }}</div>
				<div>审核时间：{{ tanDatas.management_unit_feedback_time }}</div>
				<div>
					审核单位意见：
					<p class="sj">{{ tanDatas.management_unit_feedback_content }}</p>
				</div>
				<a-divider>监管单位</a-divider>
				<a-tag color="green">同意</a-tag>
				<div>监管单位:{{ tanDatas.regulatory_unit_name }}</div>
				<div>审核人：{{ tanDatas.regulatory_unit_signer }}</div>
				<div>审核时间：{{ tanDatas.regulatory_unit_feedback_time }}</div>
				<div>
					审核单位意见：
					<p class="sj">{{ tanDatas.regulatory_unit_feedback_content }}</p>
				</div>
				<a-divider>受理单位</a-divider>
				<a-tag color="green">同意</a-tag>
				<div>受理单位：{{ tanDatas.unit_title }}</div>
				<div>审核人：{{ tanDatas.unit_signer }}</div>
				<div>审核时间：{{ tanDatas.unit_feedback_time }}</div>
				<div>
					审核单位意见：
					<p class="sj">{{ tanDatas.unit_feedback_content }}</p>
				</div>
				<a-divider>教务处审核</a-divider>
				<a-tag color="green">同意</a-tag>
				<div>审核人：{{ tanDatas.academic_office_signer }}</div>
				<div>审核时间：{{ tanDatas.academic_office_feedback_time }}</div>
				<div>
					审核单位意见：
					<p class="sj">{{ tanDatas.academic_office_feedback_content }}</p>
				</div>
			</a-modal>
		</div>
	</div>
</template>

<script>
	const Columns = [
		{
			title: "编号",
			dataIndex: "id",
			key: "id",
			ellipsis: true,
		},
		{
			title: "工作室名称",
			dataIndex: "studio_name",
			key: "studio_name",
			ellipsis: true,
		},
		{
			title: "教师姓名",
			dataIndex: "teacher_name",
			key: "teacher_name",
			ellipsis: true,
		},
		{
			title: "申请时间",
			dataIndex: "apply_time",
			key: "apply_time",
			ellipsis: true,
		},
		{
			title: "操作",
			key: "action",
			scopedSlots: { customRender: "action" },
		},
	];

	const columns2 = [
		{
			title: "所抵换的课程或课程组",
			dataIndex: "course",
			key: "course",
		},
		{
			title: "抵换方式",
			dataIndex: "way",
			key: "way",
		},
	];
	import { course_replace_scheme_get_table, courseReplaceSchemeCheck } from "../../../../../network/api";
	export default {
		props: ["record"],
		data() {
			return {
				Columns,
				tanDatas: [],
				visible: false,
				columns2,
				tableDatas: [],
				hasFile: false,
			};
		},
		created() {},
		methods: {
			download(record_id) {
				window.open("/api/teacherstudio/download/course_replace_scheme?record_id=" + record_id);
			},
			handleClick(text, record, index) {
				courseReplaceSchemeCheck({ record_id: record.id }).then(res => {
					if (res.data.data.result) {
						this.hasFile = true;
					} else {
						this.hasFile = false;
					}
				});
				course_replace_scheme_get_table({ record_id: record.id }).then(res => {
					this.visible = true;
					this.tanDatas = res.data.data;
					this.tableDatas = res.data.data.scheme;
				});
			},
			cancelClick() {
				// 关闭
				this.visible = false;
			},
			handleOk() {
				// 关闭
				this.visible = false;
			},
		},
	};
</script>
<style></style>
